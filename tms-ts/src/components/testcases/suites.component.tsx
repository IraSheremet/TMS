import {
    Button, Grid
} from "@material-ui/core";
import React, {useEffect, useMemo, useState} from "react";
import useStyles from "./styles.testcases";
import CreationCase from "./creation.case.component";
import CreationSuite from "./creation.suite.component";
import TableSuites from "./table.suites.component";
import SuiteCaseService from "../../services/suite.case.service";
import FolderSuites from "./folder.suites.component";
import {styled} from "@mui/material/styles";
import {InputLabel, MenuItem, Select, Tooltip, tooltipClasses, TooltipProps} from "@mui/material";
import 'react-splitter-layout/lib/index.css';
import PaginationSuitesComponent from "./pagination.suites.component";
import {useParams, useNavigate} from "react-router-dom";
import FormControl from "@mui/material/FormControl";
import useStylesGlobal from "../../styles/styles";


export const CustomWidthTooltip = styled(({className, ...props}: TooltipProps) => (
    <Tooltip  {...props} classes={{popper: className}}/>
))(() => ({
    [`& .${tooltipClasses.tooltip}`]: {
        marginLeft: 10,
        minWidth: 200,
        minHeight: 25,
        // backgroundColor: theme.palette.common.white,
        border: "1px solid #5c6900",
        color: "#4A4A4A",
        backgroundColor: '#fff4e5',
        fontSize: 15,
        textAlign: "start"
        // marginBottom: 10,
        // paddingBottom: 10
    },
    [`& .${tooltipClasses.arrow}`]: {
        "&:before": {
            border: "1px solid #5c6900",
            boxSizing: "border-box",
            backgroundColor: '#fff4e5'
            // borderTopWidth: 1,
        },
        fontSize: 25,
        // color: theme.palette.common.white
        // minWidth: 200,
        // minHeight: 25,
        // color: "red",
        // size: 100
    },
}));

export interface myCase {
    id: number;
    name: string;
    suite: number;
    scenario: string;
    project: number;
    estimate: number | null;
    teardown: string;
    setup: string;
    url?: string;
}

export interface treeSuite {
    id: number;
    level: number;
    name: string;
    children: treeSuite[];
    test_cases: myCase [];
}

export interface suite {
    id: number;
    name: string;
    parent: null | number;
    project: number;
    url: string;
}


const SuitesComponent: React.FC = () => {
    const classes = useStyles()
    const [showCreationCase, setShowCreationCase] = useState(false)
    const [showCreationSuite, setShowCreationSuite] = useState(false)
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const [suites, setSuites] = useState<suite []>([])
    const [treeSuites, setTreeSuites] = useState<treeSuite[]>([])
    const [infoCaseForEdit, setInfoCaseForEdit] = useState<myCase | null>(null)
    const [infoSuiteForEdit, setInfoSuiteForEdit] = useState<{ id: number, name: string } | null>(null)
    const [lastEditCase, setLastEditCase] = useState<number>(-1)
    const [selectedSuiteCome, setSelectedSuiteCome] = useState<{ id: number, name: string } | null>(null)
    const [detailedCaseInfo, setDetailedCaseInfo] = useState<{ show: boolean, myCase: myCase }>({
        show: false, myCase: {
            id: -1,
            name: "",
            suite: -1,
            scenario: "",
            project: -1,
            setup: "",
            teardown: "",
            estimate: -1
        }
    })
    const {selectedSuiteId} = useParams()
    const [selectedSuiteForTreeView, setSelectedSuiteForTreeView] = useState<treeSuite | undefined>(undefined)
    const navigate = useNavigate()
    const memoizedValueFolderStructureOfSuites = useMemo(() =>
            <FolderSuites treeSuites={selectedSuiteForTreeView} suites={suites}/>,
        [suites, treeSuites, selectedSuiteForTreeView]);
    const [countOfSuitesOnPage, setCountOfSuitesOnPage] = useState(parseInt(localStorage.getItem("countOfSuitesOnPage") ?? "20"));
    const start = 10
    const stop = 100
    const step = 5
    const classesGlobal = useStylesGlobal()


    useEffect(() => {
        SuiteCaseService.getSuites().then((response) => {
            setSuites(response.data)
        }).catch((e) => {
            console.log(e);
        });
        SuiteCaseService.getTreeSuites().then((response) => {
            setTreeSuites(response.data)
        }).catch((e) => {
            console.log(e);
        });
    }, [])

    useEffect(() => {
        if (selectedSuiteId !== undefined && treeSuites.length > 0) {
            setSelectedSuiteForTreeView(treeSuites.find(suite => suite.id === parseInt(selectedSuiteId)))
        } else if (selectedSuiteId !== undefined) {
            SuiteCaseService.getTreeBySetSuite(parseInt(selectedSuiteId)).then((response) => {
                setSelectedSuiteForTreeView(response.data)
            }).catch((e) => {
                if (e.response.status === 404) {
                    navigate("/testcases")
                }
            })
        } else {
            setSelectedSuiteForTreeView(undefined)
        }
    }, [selectedSuiteId])

    const handleShowCreationCase = () => {
        if (suites.length > 0 && selectedSuiteForTreeView !== undefined) {
            setShowCreationCase(true)
            setSelectedSuiteCome({id: selectedSuiteForTreeView.id, name: selectedSuiteForTreeView.name})
        }
    }

    const handleShowCreationSuite = () => {
        setShowCreationSuite(true)
        if (selectedSuiteForTreeView !== undefined) {
            setSelectedSuiteCome({id: selectedSuiteForTreeView.id, name: selectedSuiteForTreeView.name})
        } else {
            setSelectedSuiteCome(null)
        }
    }

    function onChangeSuitesOnPage(e: any) {
        setCountOfSuitesOnPage(e.target.value)
        localStorage.setItem("countOfSuitesOnPage", e.target.value)
    }


    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: "30%",
            },
        },
    };

    return (
        <Grid className={classes.mainGrid}>
            <Grid className={classes.leftGrid}>
                {selectedSuiteForTreeView !== undefined && <TableSuites selected={selected} setSelected={setSelected}
                                                                        setShowCreationCase={setShowCreationCase}
                                                                        setShowCreationSuite={setShowCreationSuite}
                                                                        setSelectedSuiteCome={setSelectedSuiteCome}
                                                                        suites={suites}
                                                                        selectedSuiteForTreeView={selectedSuiteForTreeView}
                                                                        setSelectedSuiteForTreeView={setSelectedSuiteForTreeView}
                                                                        setInfoCaseForEdit={setInfoCaseForEdit}
                                                                        setInfoSuiteForEdit={setInfoSuiteForEdit}
                                                                        detailedCaseInfo={detailedCaseInfo}
                                                                        setDetailedCaseInfo={setDetailedCaseInfo}
                                                                        lastEditCase={lastEditCase}
                                                                        setLastEditCase={setLastEditCase}
                                                                        setTreeSuites={setTreeSuites}
                />}
                {selectedSuiteForTreeView === undefined &&
                <PaginationSuitesComponent countOfSuitesOnPage={countOfSuitesOnPage} treeSuites={treeSuites}/>}
            </Grid>
            <Grid className={classes.rightGrid}>
                <Grid className={classes.rightGridButtons}>
                    {suites.length > 0 && selectedSuiteForTreeView !== undefined &&
                    <div>
                        <Button className={classes.buttonCreateCase} onClick={handleShowCreationCase}>Создать
                            тест-кейс</Button>
                        <CreationCase show={showCreationCase} setShow={setShowCreationCase} suites={suites}
                                      selectedSuiteCome={selectedSuiteCome} setTreeSuites={setTreeSuites}
                                      infoCaseForEdit={infoCaseForEdit}
                                      setInfoCaseForEdit={setInfoCaseForEdit}
                                      setDetailedCaseInfo={setDetailedCaseInfo}
                                      detailedCaseInfo={detailedCaseInfo}
                                      setLastEditCase={setLastEditCase}
                                      setSelectedSuiteForTreeView={setSelectedSuiteForTreeView}
                                      selectedSuiteForTreeView={selectedSuiteForTreeView}
                        />
                    </div>}
                    <Button className={classes.buttonCreateSuite} onClick={handleShowCreationSuite}>Создать
                        сьюту</Button>
                    <CreationSuite show={showCreationSuite} setShow={setShowCreationSuite} suites={suites}
                                   setSuites={setSuites}
                                   selectedSuiteCome={selectedSuiteCome} setTreeSuites={setTreeSuites}
                                   setSelectedSuiteForTreeView={setSelectedSuiteForTreeView}
                                   selectedSuiteForTreeView={selectedSuiteForTreeView}
                                   infoSuiteForEdit={infoSuiteForEdit}
                                   setInfoSuiteForEdit={setInfoSuiteForEdit}
                    />
                </Grid>
                {selectedSuiteForTreeView === undefined &&
                <div>
                    <FormControl sx={{minWidth: "90%", margin: "25px 0px 0px 15px"}}
                                 className={classesGlobal.textFieldSelectCreationCaseSuite}>
                        <InputLabel>Количество сьют на одной странице</InputLabel>
                        <Select
                            value={countOfSuitesOnPage}
                            label="Количество сьют на одной странице"
                            onChange={(e) => onChangeSuitesOnPage(e)}
                            MenuProps={MenuProps}
                        >
                            {Array.from({length: (stop - start) / step + 1}, (_, i) => start + i * step).map((num, index) =>
                                <MenuItem key={index}
                                          value={num}>{num}</MenuItem>)}
                        </Select>
                    </FormControl>
                </div>}
                {selectedSuiteForTreeView !== undefined &&
                <Grid className={classes.mainGridFolderStructure}>
                    {memoizedValueFolderStructureOfSuites}
                </Grid>}
            </Grid>
        </Grid>
    )
        ;
}

export default SuitesComponent
