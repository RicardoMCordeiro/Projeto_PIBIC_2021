//IMPORTS
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Button,
  Columns,
  Form,
  Section,
  Tabs,
  Tab,
  Table,
} from "react-bulma-components";
import Dropdown from "../../components/Dropdown";
import NavBar from "../../components/NavBar";
import { optionsMap, years, formatMoney } from "../../utils/utils.js";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import Head from 'next/head'

//TABS DOS DADOS
const DemTabs = ({ onChangeTab }) => {
  //INICIALIZA A TAB ATIVA
  const [tab, setTab] = useState("DRE");

  //REALIZA A MUDANCA DA TAB ATIVA
  const changeTab = (name) => {
    setTab(name);
    onChangeTab(name);
  };

  //SELECIONA O ITEM DA TAB ESCOLHIDA
  const Item = ({ name }) => {
    return (
      <Tabs.Tab
        active={tab === name}
        onClick={() => {
          changeTab(name);
        }}
      >
        {name}
      </Tabs.Tab>
    );
  };

  //RETORNA O "HTML" PARA A PAGINA
  return (
    <Tabs className="mt-5" type="boxed">
      <Item name="DRE" />
      <Item name="BPA" />
      <Item name="BPP" />
      <Item name="DFC MD" />
    </Tabs>
  );
};

export default function Demonstrativos() {
  //ATRIBUTOS
  const [cia, setCia] = useState(null); //COMPANHIAS
  const [accounts, setAccounts] = useState(null); //OS DADOS DA COMPANHIA
  const [query, setQuery] = useState({ q: "" }); //OS DADOS PARA A PESQUISA NO BANCO
  const [results, setResults] = useState(null); //RESULTADOS DA PESQUISA
  const [formState, setFormState] = useState({
    tipo: "ITR",
    ano: "2016",
    periodo: "1",
    info: "con",
    dem: "DRE",
  }); //INICIALIZACAO DO ESTADO ATUAL DOS DADOS (PESQUISA)

  const { promiseInProgress } = usePromiseTracker();

  //REALIZA A CONSULTA
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchResults();
  };

  //FAZ A FILTRAGEM DA PESQUISA
  const handleEvent = (e) => {
    const target = e.target;
    const name = target.name;
    const value = name === "periodo" ? optionsMap(target.value) : target.value;
     
    setFormState((state) => ({ ...state, [name]: value }));
  };

  //TRATA ALGUM EVENTO (E POSSIVEL QUE ISTO ESTEJA TOTALMENTE ERRADO)
  useEffect(() => {
    if (cia !== null) {
      fetchResultsAccounts();
    }
  }, [formState, cia]);

  //REALIZA A CONSULTA NA API
  const fetchResults = () =>
    trackPromise(
      axios
        .get("/api/cia_aberta/doc", {
          params: query,
        })
        .then((response) => response.data)
        .then(setResults)
    );

  //REALIZA A CONSULTA NA API DA COMPANHIA ESCOLHIDA
  const fetchResultsAccounts = () => 
    axios
      .get(
        `/api/cia_aberta/doc/${formState.tipo}/${formState.ano}/${formState.dem}/con/${cia.cdCvm}/${formState.periodo}`
      )
      .then((response) =>  response.data)
      .then(setAccounts)
  

  return (
    <>
      <Head>
        <title>Demonstrativos</title>
        <meta name="description" content="Confira informações financeiras das companhias abertas da CVM." />
      </Head>
      <NavBar />
      <Section>
        
        <form onSubmit={handleSubmit}>
          <Columns>
            <Columns.Column size="half">
              <Form.Field>
                <Form.Control>
                  <Form.Input
                    name="cia"
                    value={query.q}
                    placeholder="Digite o nome de uma companhia"
                    required
                    onChange={(e) => setQuery({ q: e.target.value })}
                  />
                </Form.Control>
              </Form.Field>
            </Columns.Column>
            <Columns.Column>
              <Button color="primary" loading={promiseInProgress}>Buscar</Button>
            </Columns.Column>
          </Columns>
          
          
          <Columns>
            <Columns.Column size="half">
              {results && (
                <ul>
                  {results.map((r) => (
                    <li
                      className="py-1 has-text-link is-clickable"
                      key={r.cdCvm}
                      title={`Selecionar ${r.denomCia}`}
                      onClick={() => {
                        setQuery({ q: r.denomCia });
                        setCia(r);
                        setResults(null);
                      }}
                    >
                      {r.denomCia}
                    </li>
                  ))}
                </ul>
              )}
            </Columns.Column>
          </Columns>
          <Columns className="mt-3">
            <Columns.Column narrow>
              <Dropdown 
                name="tipo"
                label="Tipo"
                options={["ITR", "DFP"]}
                onChange={handleEvent}
              />
            </Columns.Column>
            <Columns.Column narrow>
              <Dropdown
                name="ano"
                label="Ano"
                options={years()}
                onChange={handleEvent}
              />
            </Columns.Column>
            <Columns.Column narrow>
              <Dropdown
                name="periodo"
                label="Período"
                options={["31/03", "30/06", "30/09"]}
                onChange={handleEvent}
              />
            </Columns.Column>
            <Columns.Column narrow>
              <Dropdown
                name="info"
                label="Informação"
                options={["Consolidada", "Individual"]}
                onChange={handleEvent}
              />
            </Columns.Column>
          </Columns>
          <DemTabs
            onChangeTab={(t) => setFormState((state) => ({ ...state, dem: t }))}
          />
        </form>
        
        
        
        <Table.Container>
          <Table className="mt-5" size="fullwidth">
            <thead>
              <tr>
                <th>Conta</th>
                <th>Descrição</th>
                <th align="right">Valor em R$ (MIL)</th>
              </tr>
            </thead>
            <tbody>
              {accounts && accounts.length != 0 &&

                accounts[0].contas.map((row) => (
                  <tr key={`${row.cdConta}${row.vlConta}`}>
                    <td>{row.cdConta}</td>
                    <td>{row.dsConta}</td>
                    <td style={{ textAlign: "right" }}>
                      {formatMoney(row.vlConta, true, 1)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Table.Container>
      </Section>
    </>
  );
}