import Head from "next/head";
import { Heading, Section, Table } from "react-bulma-components";
import NavBar from "../../components/NavBar";
import { getCia } from "../../utils/api";
import { formatPhone } from "../../utils/utils";

export default function Companhia({ data }) {
  const [cia] = data;
  console.log(cia);

  const renderRow = (row, value) =>
    value ? (
      <tr>
        <td>{row}</td>
        <td>{value}</td>
      </tr>
    ) : null;

  const renderCia = () => {
    return (
      <>
        <Head>
          <title>{cia.denomSocial}</title>
          <meta
            name="description"
            content={`Confira informações cadastrais de ${cia.denomSocial}`}
          />
        </Head>
        <Table size="fullwidth" striped>
          <thead>
            <th className="has-background-primary has-text-white" colSpan={2}>
              Informações cadastrais
            </th>
          </thead>
          <tbody>
            {renderRow("CVM", cia.cdCvm)}
            {renderRow("Denominação Social", cia.denomSocial)}
            {renderRow("Denominação Comercial", cia.denomComerc)}
            {renderRow("CNPJ", cia.cnpjCia)}
            {renderRow("Setor Ativo", cia.setorAtiv)}
            {renderRow("Situação", cia.sit)}
            {renderRow("Motivo cancelamento", cia.motivoCancel)}
          </tbody>
          <thead>
            <th className="has-background-primary has-text-white" colSpan={2}>
              Informações de endereço
            </th>
          </thead>
          <tbody>
            {renderRow("País", cia.pais)}
            {renderRow("UF", cia.uf)}
            {renderRow("Município", cia.mun)}
            {renderRow("CEP", cia.cep)}
            {renderRow("Bairro", cia.bairro)}
            {renderRow("Logradouro", cia.logradouro)}
          </tbody>
          <thead>
            <th className="has-background-primary has-text-white" colSpan={2}>
              Informações de contato
            </th>
          </thead>
          <tbody>
            {renderRow("Email", cia.email)}
            {renderRow("Telefone", formatPhone(cia.dddTel, cia.tel))}
            {renderRow("Fax", formatPhone(cia.dddFax, cia.fax))}
          </tbody>
          <thead>
            <th className="has-background-primary has-text-white" colSpan={2}>
              Informações do responsável
            </th>
          </thead>
          <tbody>
            {renderRow("Nome", cia.resp)}
            {renderRow("Telefone", formatPhone(cia.dddTelResp, cia.telResp))}
            {renderRow("Tipo", cia.tpResp)}
          </tbody>
          <thead>
            <th className="has-background-primary has-text-white" colSpan={2}>
              Informações do auditor
            </th>
          </thead>
          <tbody>
              {renderRow("Auditor", cia.auditor)}
              {renderRow("CNPJ", cia.cnpjAuditor)}
          </tbody>
        </Table>
      </>
    );
  };

  return (
    <div>
      <NavBar />
      <Section>{cia && renderCia()}</Section>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { cvm } = context.query;
  const data = await getCia(cvm);

  return {
    props: { data: data },
  };
}