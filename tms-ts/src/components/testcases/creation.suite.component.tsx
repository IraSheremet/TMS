import React, {useEffect, useState} from "react";
import useStyles from "../../styles/styles";
import {
    Alert, Box,
    Button, Collapse,
    Dialog,
    FormControl,
    Grid,
    InputLabel, MenuItem, Select, SelectChangeEvent,
    TextField,
    Typography
} from "@mui/material";
import SuiteCaseService from "../../services/suite.case.service";
import {CustomWidthTooltip, suite, treeSuite} from "./suites.component";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";


interface Props {
    show: boolean;
    setShow: (show: boolean) => void;
    suites: suite [],
    selectedSuiteCome: { id: number, name: string } | null
    setTreeSuites: (treeSuites: treeSuite[]) => void
    setSuites: (suites: suite[]) => void
}

const CreationSuite: React.FC<Props> = ({show, setShow, suites, selectedSuiteCome, setTreeSuites, setSuites}) => {
    const classes = useStyles()
    const [selectedSuite, setSelectedSuite] = useState<{ id: number; name: string } | null>(selectedSuiteCome)
    const [name, setName] = useState("")
    const [namePresence, setNamePresence] = useState(false)
    const [fillFieldName, setFillFieldName] = useState(false)

    const handleClose = () => {
        setShow(false)
        setName("")
        setNamePresence(false)
        setFillFieldName(false)
    }

    useEffect(() => {
        setSelectedSuite(selectedSuiteCome)
    }, [selectedSuiteCome])

    const chooseSuite = (e: any) => {
        setSelectedSuite(e.target.value ? {id: e.target.value.id, name: e.target.value.name} : null)
    }

    const createSuite = () => {
        if (namePresence) {
            const suite = {
                name: name,
                parent: selectedSuite ? selectedSuite.id : null,
                project: 1,
            }
            SuiteCaseService.createSuite(suite).then(() => {
                SuiteCaseService.getTreeSuites().then((response) => {
                    setTreeSuites(response.data)
                    SuiteCaseService.getSuites().then((response) => {
                        setSuites(response.data)
                    })
                })
            })
            setShow(false)
            setName("")
            setNamePresence(false)
            setFillFieldName(false)

        } else {
            // @ts-ignore
            document.getElementById("nameTextField").focus();
            setFillFieldName(true)
        }
    }

    const onChangeName = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let str = e.target.value
        if (str.length > 0) {
            setName(str)
            setNamePresence(true)
            setFillFieldName(false)
        } else {
            setName(str)
            setNamePresence(false)
        }
    }

    return (
        <Dialog
            disableEnforceFocus
            open={show}
            onClose={handleClose}
            classes={{paper: classes.paperCreationSuite}}
        >
            <form
                style={{
                    display: "flex"
                }}
                // onSubmit={createSuite}
            >
                <Grid container style={{
                    position: "absolute",
                    height: "100%",
                    width: "100%"
                }}>
                    <Grid xs={9} item style={{padding: 20}}>
                        <Grid>
                            <Typography variant="h6">
                                Название сьюты
                            </Typography>

                            {/*<Collapse in={fillFieldName}>*/}
                            {/*    <Alert style={{borderRadius: "10px 10px 1px 10px"}} className={classes.alertNotFilled} severity="warning">Заполните это*/}
                            {/*        поле.</Alert>*/}
                            {/*    <Grid className={classes.triangle}/>*/}
                            {/*</Collapse>*/}
                            <CustomWidthTooltip
                                title={<Grid style={{display: "flex", flexDirection: 'row'}}><WarningAmberIcon
                                    sx={{fontSize: 25, marginRight: 1}}/> <Typography> Заполните это
                                    поле.</Typography></Grid>} placement="top-start" arrow
                                open={fillFieldName}>
                            <TextField
                                id="nameTextField"
                                // sx={{marginTop: fillFieldName ? 0.5 : ""}}
                                onChange={(content) => onChangeName(content)}
                                className={classes.textFieldSelectCreationCaseSuite}
                                variant="outlined"
                                margin="normal"
                                // helperText={fillFieldName && "Заполните это поле."}
                                required
                                fullWidth
                                autoComplete="off"
                                value={name}
                                label="Введите название сьюты"
                            />
                            </CustomWidthTooltip>
                        </Grid>
                    </Grid>
                    <Grid xs={3} item style={{
                        backgroundColor: "#eeeeee", paddingTop: 26, display: "flex",
                        flexDirection: "column", justifyContent: "space-between"
                    }}>
                        <Grid style={{marginLeft: 15}}>
                            <Typography style={{marginBottom: 10}}>
                                Родительская сьюта
                            </Typography>

                            <FormControl style={{minWidth: "90%"}} className={classes.textFieldSelectCreationCaseSuite}>
                                <InputLabel id="select-suite">Выберите сьюту</InputLabel>
                                <Select
                                    labelId="select-suite"
                                    value={selectedSuite ? selectedSuite.name : "Не выбрано"}
                                    label="Выберите сьюту"
                                    onChange={(e) => chooseSuite(e)}
                                    renderValue={(selected) => <Grid>{selected}</Grid>}
                                >
                                    <MenuItem value={null as any}>
                                        <em>Не выбрано</em>
                                    </MenuItem>
                                    {suites.map((suite, index) => <MenuItem key={index}
                                                                            value={suite as any}>{suite.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid style={{textAlign: "center"}}>
                            <Grid>
                                <Button onClick={handleClose} style={{
                                    marginRight: 7,
                                    marginBottom: 20,
                                    width: "40%",
                                    height: "45%",
                                    backgroundColor: "#FFFFFF",
                                    color: "#000000",
                                }}
                                >
                                    Отменить
                                </Button>
                                <Button
                                    // type={"submit"}
                                    onClick={createSuite}
                                    style={{
                                        marginLeft: 7,
                                        marginBottom: 20,
                                        width: "40%",
                                        height: "45%",
                                        backgroundColor: "#696969",
                                        color: "#FFFFFF",
                                    }}
                                >
                                    Сохранить
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </form>
        </Dialog>
    )
}

export default CreationSuite