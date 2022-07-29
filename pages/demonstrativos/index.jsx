import axios from "axios";
import { useEffect, useState } from "react";
import {
  Button,
  Columns,
  Form,
  Section,
  Tabs,
  Table,
} from "react-bulma-components";
import Dropdown from "../../components/Dropdown";
import ExportToCSV from "../../components/ExportToCSV";
import NavBar from "../../components/NavBar";
import { optionsMap, years, formatMoney, adjustmentStatement } from "../../utils/utils.js";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import Head from "next/head";


const DemTabs = ({ onChangeTab }) => {
  const [tab, setTab] = useState("DRE");

  const changeTab = (name) => {
    setTab(name);
    onChangeTab(name);
  };

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

  return (
    <Tabs className="mt-5" type="boxed">
      <Item name="DRE" />
      <Item name="BPA" />
      <Item name="BPP" />
      <Item name="DFC MI" />
    </Tabs>
  );
}

export default function Demonstrativos() {
  const dataAtual = new Date();
  const anoInicial = dataAtual.getFullYear() - 5

  const [cia, setCia] = useState(null); // Companhias
  const [accounts, setAccounts] = useState(null);
  const [query, setQuery] = useState({ q: "" }); // Busca por barra de pesquisa
  const [results, setResults] = useState(null); // Resultados da pesquisa
  const [formState, setFormState] = useState({
    tipo: "ITR",
    ano: anoInicial,
    periodo: "1",
    info: "con",
    dem: "DRE",
  });

  const { promiseInProgress } = usePromiseTracker();

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchResults();       // Vai buscar no pages/api/doc
  };

  const handleEvent = (e) => {
    const target = e.target;  // e.target retorna um html
    const name = target.name; // target.name retorna o nome do dado selecionado
    const value = name === "periodo" ? 
      optionsMap(target.value) : name === "info" ?
      adjustmentStatement(target.value) : target.value;

    setFormState((state) => ({ ...state, [name]: value }));
  };

  useEffect(() => {
    if (cia !== null) {
      fetchResultsAccounts();
    }
  }, [formState, cia]);

  const fetchResults = () =>
    trackPromise(
      axios
        .get("/api/cia_aberta/doc", {
          params: query,
        })
        .then((response) => response.data)
        .then(setResults)
    );

  const fetchResultsAccounts = () =>
    axios
      .get(
        `/api/cia_aberta/doc/${formState.tipo}/${formState.ano}/${formState.dem}/${formState.info}/${cia.cdCvm}/${formState.periodo}`
      )
      .then((response) => response.data)
      .then(setAccounts);

  return (
    <>
      <Head>
        <title>Demonstrativos</title>
        <meta name="description" content="Confira informações financeiras das companhias abertas da CVM." />
      </Head>

      <NavBar />

      <Section>
                
        <form onSubmit={handleSubmit}>
          <Columns>   {/* Barra de pesquisa */}
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
              <Button color="primary" loading={promiseInProgress}>Buscar</Button>  {/* Botão de busca */}
            </Columns.Column>

            <Columns.Column>{
              accounts && accounts.length !== 0 &&
              <ExportToCSV {  ...accounts[0] } />}
            </Columns.Column>

          </Columns>

          <Columns>  {/* Mostra os dados da pesquisa */}
            <Columns.Column size="half">
              {results && (
                <ul>
                  {results.map((row) => (
                    <li
                      className="py-1 has-text-link is-clickable"
                      key={row.cdCvm}
                      title={`Selecionar ${row.denomCia}`}
                      onClick={() => {
                        setQuery({ q: row.denomCia });
                        setCia(row);
                        setResults(null);
                      }}
                    >
                      {row.denomCia}
                    </li>
                  ))}
                </ul>
              )}
            </Columns.Column>
          </Columns>

          <Columns className="mt-3">  
            <Columns.Column narrow>  {/* Dropdown dos tipos ITR ou DFP */}
              <Dropdown 
                name="tipo"
                label="Tipo"
                value={formState.tipo}
                options={["ITR", "DFP"]}
                onChange={handleEvent}
              />
            </Columns.Column>

            <Columns.Column narrow>   {/* Dropdown dos anos */}
              <Dropdown 
                name="ano"
                label="Ano"
                value={formState.ano}
                options={years()}
                onChange={handleEvent}
              />
            </Columns.Column>

            <Columns.Column narrow>   {/* Dropdown dos períodos */}
              <Dropdown 
                name="periodo"
                label="Período"
                options={["31/03", "30/06", "30/09"]}
                onChange={handleEvent}
              />
            </Columns.Column>
                        
            <Columns.Column narrow>    {/* Dropdown dos demonstrativos Consolidada ou Individual */}
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
                
        <Table.Container>    {/* Área das informações da empresa pesquisada */}
          <Table className="mt-5" size="fullwidth">
            <thead>
              <tr>
                <th>Conta</th>
                <th>Descrição</th>
                <th align="right">Valor em R$ (MIL)</th>
              </tr>
            </thead>
            <tbody>
              {accounts &&
                accounts.length !== 0 &&
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
        {accounts && accounts.length === 0 && <p>Sem resultados.</p>}
      </Section>
    </>
  );
}