import {
    Button, Grid
} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import useStyles from "../../styles/styles";
import CreationCase from "./creation.case.component";
import CreationSuite from "./creation.suite.component";
import TableSuites from "./table.suites.component";
import SuiteCaseService from "../../services/suite.case.service";
import FolderSuites from "./folder.suites.component";

interface myCase {
    id: number;
    name: string;
    suite: number;
    scenario: string;
    project: number;
    estimate: number
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
    const [cases, setCases] = useState([])
    const [selectedSuiteCome, setSelectedSuiteCome] = useState<{ id: number, name: string } | null>(null)

    useEffect(() => {
        // SuiteCaseService.authorize().then((response) => {
        //     const token = response.data.access
            SuiteCaseService.getSuites().then((response) => {
                // const localSuites = response.data
                setSuites(response.data)
                // for (let i = 0; i< response.data.length; i++){
                //     SuiteCaseService.deleteSuite(response.data[i].id).then((r)=> console.log(r))
                // }
                SuiteCaseService.getCases().then((response) => {
                    // const localCases = response.data
                    setCases(response.data)
                    SuiteCaseService.getTreeSuites().then((response) => {
                        // const localTreeSuites = response.data
                        setTreeSuites(response.data)
                    })
                })
            })
        // })
            .catch((e) => {
                console.log(e);
            });
    }, [])

    const handleShowCreationCase = () => {
        if (suites.length > 0) {
            setShowCreationCase(true)
            setSelectedSuiteCome({id: suites[0].id, name: suites[0].name})
        }
    }

    const handleShowCreationSuite = () => {
        setShowCreationSuite(true)
        setSelectedSuiteCome(null)
    }
    return (
        <Grid  style={{
            marginTop: 0,
            position: "absolute",
            display: "flex",
            height: "91%",
            width: "100%"
        }}>
            <Grid   style={{
                overflowY: "auto", maxHeight: "100%", width: "80%"
            }}>
                <TableSuites selected={selected} setSelected={setSelected}
                             setShowCreationCase={setShowCreationCase}
                             setShowCreationSuite={setShowCreationSuite}
                             setSelectedSuiteCome={setSelectedSuiteCome}
                             suites={treeSuites}
                />
            </Grid>
            <Grid   style={{
                backgroundColor: "#eeeeee",
                width: "20%"
            }}>
                <Grid style={{display: "flex", flexDirection: "column"}}>
                    <Grid style={{textAlign: "center",}}>
                        <Button style={{
                            margin: 15,
                            minWidth: "70%",
                            height: "45%",
                            backgroundColor: "#FFFFFF",
                            color: "#000000",
                        }} onClick={handleShowCreationCase}>Создать тест-кейс</Button>
                        <Button style={{
                            minWidth: "70%",
                            height: "45%",
                            backgroundColor: "#696969",
                            color: "#FFFFFF",
                        }} onClick={handleShowCreationSuite}>Создать сьюту</Button>
                        {suites.length > 0 &&
                        <CreationCase show={showCreationCase} setShow={setShowCreationCase} suites={suites}
                                      selectedSuiteCome={selectedSuiteCome} setTreeSuites={setTreeSuites}/>}
                        <CreationSuite show={showCreationSuite} setShow={setShowCreationSuite} suites={suites}
                                       setSuites={setSuites}
                                       selectedSuiteCome={selectedSuiteCome} setTreeSuites={setTreeSuites}/>
                    </Grid>
                </Grid>
                <Grid style={{backgroundColor: "white", borderRadius: 10, margin: 13,
                    height: 400, maxHeight: 500, overflowY: "auto", overflowX: "auto"}}>
                    <FolderSuites suites={treeSuites}/>
                </Grid>
            </Grid>
        </Grid>
    )
        ;
}

export default SuitesComponent
