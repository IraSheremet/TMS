import React, {ChangeEvent, useEffect, useState} from 'react';
import {
    Button,
    Checkbox, Chip,
    FormControlLabel,
    FormGroup,
    Grid,
    Paper,
    Stack,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    Zoom
} from "@mui/material";
import LineChartComponent from "./charts/line.chart.component";
import PieChartComponent from "./charts/pie.chart.component";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import moment, {Moment} from "moment";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import {test, testPlan, user} from "../models.interfaces";
import ProjectService from "../../services/project.service";
import {statuses} from "../model.statuses";
import useStyles from "../../styles/styles";
import ProjectSettings from "./project.settings";

const Project: React.FC = () => {
    const classes = useStyles();
    const labels = [['ID', '#000000'], ['НАЗВАНИЕ ТЕСТ-ПЛАНА', '#000000'], ['ВСЕГО ТЕСТОВ', '#000000']];
    const minStatusIndex = labels.length;
    statuses.map((status) => labels.push([status.name.toUpperCase(), status.color]))
    labels.push(['ДАТА ИЗМЕНЕНИЯ', '#000000'], ['КЕМ ИЗМЕНЕНО', '#000000'])
    const maxStatusIndex = minStatusIndex + statuses.length - 1;

    const [isSwitched, setSwitch] = React.useState(false);
    const handleOnSwitch = (event: ChangeEvent<HTMLInputElement>) => setSwitch(event.target.checked);
    const [showFilter, setShowFilter] = React.useState(false);
    const handleOnOpenFilter = () => setShowFilter(!showFilter);
    const [startDate, setStartDate] = React.useState<Moment | null>(moment("01.01.1970", "DD.MM.YYYY"));
    const [endDate, setEndDate] = React.useState<Moment | null>(moment());
    const handleChangeStartDate = (newValue: Moment | null) => setStartDate(newValue);
    const handleChangeEndDate = (newValue: Moment | null) => setEndDate(newValue);
    const [showProjectSettings, setShowProjectSettings] = useState(false)
    const handleShowProjectSettings = () => {
        setShowProjectSettings(true)
    }
    const handleOnShowStatus = (status: string) => {
        setStatusesToShow({...statusesShow, [status]: !statusesShow[status]})
    };
    const [tests, setTests] = useState<test[]>([])
    const [testPlans, setTestPlans] = useState<testPlan[]>([])
    const [users, setUsers] = useState<user[]>([])

    const projectValue = JSON.parse(localStorage.getItem("currentProject") ?? '')
    const currentUsername = localStorage.getItem('currentUsername')

    let dataForLineChart: test[] = []
    const projectTableData = testPlans.map((value) => {
        let date = value.started_at
        const results: { [key: string]: number; } = {
            "all": value.tests.length,
        }
        let editorId: number | null = null;
        statuses.map((status) => results[status.name.toLowerCase()] = 0)
        value.tests.sort((a, b) =>
            moment(b.updated_at, "YYYY-MM-DDThh:mm").valueOf() - moment(a.updated_at, "YYYY-MM-DDThh:mm").valueOf())
        date = value.tests[0]?.updated_at ?? date
        if (value.tests.length > 0) {
            const currentTest = tests.find((test) => test.id === value.tests[0].id)
            editorId = currentTest?.user ?? editorId
        }
        const editor = (editorId != null) ?
            users.find((value) => value.id === editorId) : null
        const editorName = (editor != null) ? editor.username : "Не назначен"
        dataForLineChart = dataForLineChart.concat(value.tests)
        value.tests.forEach((test) => {
            test.current_result ? results[String(test.current_result).toLowerCase()]++ : results["untested"]++
        });

        const toReturn = [value.id, value.name, results.all]
        statuses.map((status) => toReturn.push(results[status.name.toLowerCase()]))
        toReturn.push(date, editorName)
        return toReturn
    });
    projectTableData.sort(([, , , , , , firstDate,], [, , , , , , secondDate,]) =>
        (moment(secondDate, "YYYY-MM-DDThh:mm").valueOf() - moment(firstDate, "YYYY-MM-DDThh:mm").valueOf()))
    const personalTableData = projectTableData.filter((value) => value[value.length - 1] === currentUsername)

    const [statusesShow, setStatusesToShow] = React.useState<{ [key: string]: boolean; }>({});

    const charts = [<LineChartComponent tests={dataForLineChart}/>, <PieChartComponent tests={tests}/>];

    useEffect(() => {
        statuses.forEach((status) => {
            const temporaryValue = statusesShow
            temporaryValue[status.name.toLowerCase()] = true
            setStatusesToShow(temporaryValue)
        })

        ProjectService.getTestPlans().then((response) => {
            const testPlansData: testPlan[] = response.data
            setTestPlans(testPlansData.filter((value) => value.project === projectValue.id))

            ProjectService.getTests().then((response) => {
                const testsData: test[] = response.data
                setTests(testsData.filter((value) => value.project === projectValue.id))

                ProjectService.getUsers().then((response) => {
                    setUsers(response.data)

                })
            })
        })
            .catch((e) => {
                console.log(e);
            });
    }, [])

    const filter = <Zoom in={showFilter} style={{marginBottom: '10px', marginTop: "10px"}}>
        <Grid sx={{display: 'flex', justifyContent: 'center'}}>
            <FormGroup sx={{display: 'flex', justifyContent: 'center', flexDirection: 'row'}}>
                {statuses.map((status, index) =>
                    <FormControlLabel key={index}
                                      control={<Checkbox checked={statusesShow[status.name.toLowerCase()]}
                                                         onClick={() => handleOnShowStatus(status.name.toLowerCase())}/>}
                                      label={<Chip key={index} label={status.name.toUpperCase()}
                                                   style={{
                                                       margin: 3,
                                                       maxWidth: "95%",
                                                       backgroundColor: status.color,
                                                       color: "white"
                                                   }}/>}/>
                )}
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <div style={{marginLeft: '10px'}}>
                        <DesktopDatePicker
                            className={classes.centeredField}
                            label="Выберите дату начала"
                            inputFormat="DD/MM/YYYY"
                            value={startDate}
                            onChange={handleChangeStartDate}
                            renderInput={(params) => <TextField className={classes.centeredField} {...params} />}
                        />
                    </div>
                    <div style={{marginLeft: '10px'}}>
                        <DesktopDatePicker
                            className={classes.centeredField}
                            label="Выберите дату окончания"
                            inputFormat="DD/MM/YYYY"
                            value={endDate}
                            onChange={handleChangeEndDate}
                            renderInput={(params) => <TextField className={classes.centeredField} {...params} />}
                        />
                    </div>
                </LocalizationProvider>
            </FormGroup>
        </Grid>
    </Zoom>

    const tableDataToShow = <TableBody>
        {(isSwitched ? personalTableData : projectTableData)?.map(
            (testplanData, planIndex) =>
                (!moment(testplanData[testplanData.length - 2], "YYYY-MM-DDThh:mm").isBetween(startDate, endDate, undefined, "[]")) ? null :
                    (
                        <TableRow key={planIndex} style={{cursor: "pointer"}} hover={true}
                                  onClick={() => window.location.assign("/testplans/" + testplanData[0])}>
                            {testplanData.slice(0, testplanData.length - 2).concat([moment(testplanData[testplanData.length - 2], "YYYY-MM-DDThh:mm")
                                .format("DD.MM.YYYY"), testplanData[testplanData.length - 1]]).map(
                                (value, index) => {
                                    if (index < minStatusIndex || index > maxStatusIndex) {
                                        return <TableCell key={planIndex + "." + index}>
                                            <Typography align={'center'}>{value}</Typography>
                                        </TableCell>
                                    }
                                    if (statusesShow[statuses[index - minStatusIndex].name.toLowerCase()]) {
                                        return <TableCell key={planIndex + "." + index}>
                                            <Typography align={'center'}>{value}</Typography>
                                        </TableCell>
                                    }
                                    return <></>;
                                }
                            )}
                        </TableRow>)
        )}
    </TableBody>

    return (
        <div style={{display: "flex", flexDirection: "column"}}>
            <Grid sx={{display: 'flex', justifyContent: 'center', mt: '20px'}}>
                {tests.length > 0 ? charts.map((chart, index) =>
                        <div key={index} style={{width: "45%"}}>
                            {chart}
                        </div>)
                    : <></>}
            </Grid>
            <Grid sx={{width: '100%', justifyContent: 'center', pt: '50px'}}>
                <Paper
                    elevation={5}
                    sx={{
                        alignSelf: 'center',
                        justifyContent: 'center',
                        padding: "20px 10px 10px 10px",
                    }}>
                    <Stack>
                        <Stack display={'flex'} flexDirection={"row"} justifyContent={"center"} mb={'10px'}>
                            <Stack direction={"row"}>
                                {isSwitched ?
                                    <Typography fontSize={24} mr={'5px'} ml={'5px'} color={'grey'}>
                                        Проекта
                                    </Typography>
                                    :
                                    <Typography fontSize={24} mr={'5px'} ml={'5px'}>
                                        Активность проекта
                                    </Typography>
                                }
                                <Switch checked={isSwitched} onChange={handleOnSwitch}/>
                                {isSwitched ?
                                    <Typography fontSize={24} mr={'5px'} ml={'5px'}>
                                        Моя активность
                                    </Typography>
                                    :
                                    <Typography fontSize={24} mr={'5px'} ml={'5px'} color={'grey'}>
                                        Моя
                                    </Typography>
                                }
                            </Stack>
                            <Button variant="contained"
                                    style={{marginLeft: '10px', backgroundColor: "#696969"}}
                                    onClick={handleOnOpenFilter}>Фильтр</Button>
                            <Button variant="contained"
                                    style={{marginLeft: '10px', backgroundColor: "#696969"}}
                                    onClick={handleShowProjectSettings}
                            >Настройки</Button>
                        </Stack>
                        <ProjectSettings show={showProjectSettings} setShow={setShowProjectSettings}/>
                        {showFilter ? filter : null}
                        <TableContainer component={Paper}>
                            <Table stickyHeader>
                                <TableHead sx={{mb: '20px'}}>
                                    <TableRow>
                                        {labels.map(([value, color], index) => {
                                            if (!statuses.find((status) => status.name.toLowerCase() === value.toLowerCase())) {
                                                return <TableCell key={index}>
                                                    <Typography color={color} fontWeight={'bolder'}
                                                                align={'center'}>{value}</Typography>
                                                </TableCell>
                                            }
                                            if (statusesShow[value.toLowerCase()]) {
                                                return <TableCell key={index}>
                                                    <div style={{textAlign: "center"}}>
                                                        <Chip key={index} label={value}
                                                              style={{
                                                                  margin: 3,
                                                                  maxWidth: "95%",
                                                                  backgroundColor: statuses[index - minStatusIndex].color,
                                                                  color: "white"
                                                              }}/>
                                                    </div>
                                                </TableCell>
                                            }
                                            return <></>;
                                        })}
                                    </TableRow>
                                </TableHead>
                                {tableDataToShow}
                            </Table>
                        </TableContainer>
                    </Stack>
                </Paper>
            </Grid>
        </div>
    );
};

export default Project;