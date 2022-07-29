import React from 'react';
import { CSVLink } from 'react-csv';
import { Button } from 'react-bulma-components';

export default function ExportToCSV(...props) {
    
    const { Parser, transforms: { unwind } } = require('json2csv');

    var dadosConta = [] /* Definição de um lista para armazenar dados da conta. */

    props[0].contas.forEach(element => {
        dadosConta.push(element.cdConta)
        dadosConta.push(element.dsConta)
        dadosConta.push(element.vlConta)
    });

    const data = [
        {   
            tipo: props[0].tipo, 
            info: props[0].info, 
            demonstrativo: props[0].demonstrativo,
            ano: props[0].ano,
            cnpjCia: props[0].cnpjCia,
            denomCia: props[0].denomCia,
            cdCvm: props[0].cdCvm,
            dtRefer: props[0].dtRefer,
            contas: dadosConta 
        }
    ];

    const fields = ['tipo', 'info', 'demonstrativo', 'ano', 'cnpjCia', 'cdCvm', 'dtRefer', 'contas'];
    const transforms = [unwind({ paths: ['contas'] })];

    const json2csvParser = new Parser({ fields, transforms });
    const csv = json2csvParser.parse(data);

    const csvReport = {
        data: csv,
        filename: 'Empresa.csv'
    };

    return (
        <div>
            <Button><CSVLink {...csvReport}>Download</CSVLink></Button>
        </div>
    );
} 
