import {
  Button,
  Columns,
  Form,
  Section,
  Icon,
  Table,
} from "react-bulma-components";
import Dropdown from "../../components/Dropdown";
import NavBar from "../../components/NavBar";
import { useState, useEffect } from "react";
import axios from "axios";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import Head from "next/head";
import { useRouter } from "next/router";

export default function CiasAbertas() {
const handleSubmit = (e) => {
  e.preventDefault();
  fetchResults(formState);
};

const { promiseInProgress } = usePromiseTracker();
const router = useRouter();

const fetchResults = (params) =>
  trackPromise(
    axios
      .get("/api/cia_aberta/cad", {
        params: params,
      })
      .then((response) => response.data)
      .then(setResults)
  );

const handleEvent = (e) => {
  const target = e.target;
  const name = target.name;
  const value = target.value;

  setFormState((state) => ({ ...state, [name]: value }));
};

const [formState, setFormState] = useState({
  denomSocial: "",
  sit: "TODAS",
  uf: "TODAS",
  dtReg: "",
  dtCancel: "",
 });

const [firstChar, setFirstChar] = useState("");
const [ufs, setUfs] = useState(null);
const [results, setResults] = useState(null);

useEffect(() => {
  axios
    .get(
      "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
    )
    .then((response) => response.data.map((uf) => uf.sigla))
    .then(setUfs);
}, []);

useEffect(() => {
  if (firstChar) {
    fetchResults({ firstChar: firstChar });
  }
}, [firstChar]);

return (
  <div>
    <Head>
      <title>Companhias</title>
      <meta
        name="description"
        content="Confira informações cadastrais das companhias abertas da CVM."
      />
    </Head>
    <NavBar />
    <Section>
      <form onSubmit={handleSubmit}>
        <Form.Label>Buscar por letra</Form.Label>
        <Button.Group size="small" hasAddons>
          {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((char) => (
            <Form.Control key={char}>
              <Button
                type="button"
                color={char === firstChar ? "primary" : "white-bis"}
                isSelected={char === firstChar}
                onClick={() => setFirstChar(char)}
              >
                {char}
              </Button>
            </Form.Control>
          ))}
        </Button.Group>
        <p>Ou se preferir use os filtros:</p>
        <div className="my-4">
          <Columns size={5}>
            <Columns.Column>
              <Form.Field>
                <Form.Label>Pesquise por uma companhia</Form.Label>
                <Form.Control>
                  <Form.Input
                    name="denomSocial"
                    placeholder="Busque por uma companhia"
                    type="text"
                    value={formState.denomSocial}
                    onChange={handleEvent}
                  />
                </Form.Control>
              </Form.Field>
            </Columns.Column>
            <Columns.Column narrow>
              <Dropdown
                name="sit"
                label="Situação"
                value={formState.sit}
                options={["TODAS", "ATIVO", "CANCELADA"]}
                onChange={handleEvent}
              />
            </Columns.Column>
            <Columns.Column narrow>
              {ufs && (
                <Dropdown
                  name="uf"
                  label="UF"
                  value={formState.uf}
                  options={["TODAS", ...ufs]}
                  onChange={handleEvent}
                />
              )}
            </Columns.Column>
            <Columns.Column size={2}>
              <Form.Field>
                <Form.Label>Registro</Form.Label>
                <Form.Control>
                  <Form.Input
                    name="dtReg"
                    placeholder="DD/MM/AAAA"
                    type="text"
                    value={formState.dtReg}
                    onChange={handleEvent}
                  />
                  <Icon align="right" size="small">
                    <FontAwesomeIcon icon={faCalendar} />
                  </Icon>
                </Form.Control>
              </Form.Field>
            </Columns.Column>
            <Columns.Column size={2}>
              <Form.Field>
                <Form.Label>Cancelamento</Form.Label>
                <Form.Control>
                  <Form.Input
                    name="dtCancel"
                    placeholder="DD/MM/AAAA"
                    type="text"
                    value={formState.dtCancel}
                    onChange={handleEvent}
                  />
                  <Icon align="right" size="small">
                    <FontAwesomeIcon icon={faCalendar} />
                  </Icon>
                </Form.Control>
              </Form.Field>
            </Columns.Column>
          </Columns>
          <Button color="primary" loading={promiseInProgress}>
            Pesquisar
          </Button>
        </div>
      </form>
      <Table.Container>
        <Table className="mt-3" size="fullwidth" hoverable>
          <thead>
            <tr>
              <th>CVM</th>
              <th>Denominação Social</th>
              <th>CNPJ</th>
              <th>UF</th>
              <th>Situação</th>
            </tr>
          </thead>
          <tbody>
            {results &&
              results.map((row) => (
                <tr
                  title={`Clique para ver mais sobre ${row.denomSocial}`}
                  className="is-clickable"
                  key={row._id}
                  onClick={() => router.push(`/companhias/${row.cdCvm}`)}
                >
                  <td>{row.cdCvm}</td>
                  <td>{row.denomSocial}</td>
                  <td>{row.cnpjCia}</td>
                  <td>{row.uf}</td>
                  <td>{row.sit}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Table.Container>
    </Section>
  </div>
);
}