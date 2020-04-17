import React, { Component } from 'react'
import XLSX from 'xlsx';
import {make_cols} from './MakeColomns'
import {SheetJSFT} from './Types';
import './ExcelReader.css';
import img1 from '../images/upload.png';

export default class ExcelReader extends Component {
    constructor(props) {
        super(props);
        this.state = {
          file: {},
          data: [],
          cols: []
        }
        this.handleFile = this.handleFile.bind(this);
        this.handleChange = this.handleChange.bind(this);
      }
     
      handleChange(e) {
        const files = e.target.files;
        if (files && files[0]) this.setState({ file: files[0] });
      };
     
      handleFile() {
        /* Boilerplate pour configurer FileReader */
        const reader = new FileReader();
        const rABS = !!reader.readAsBinaryString;
     
        reader.onload = (e) => {
          /* Analyser les données */
          const bstr = e.target.result;
          const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA : true });
          /* Obtenir la première feuille de calcul */
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          /* Convertir un tableau de tableaux */
          const data = XLSX.utils.sheet_to_json(ws);
          /* Update state */
          this.setState({ data: data, cols: make_cols(ws['!ref']) }, () => {
            console.log(JSON.stringify(this.state.data, null, 2));
          });
     
        };
     
        if (rABS) {
          reader.readAsBinaryString(this.state.file);
        } else {
          reader.readAsArrayBuffer(this.state.file);
        };
      }
  render() {
    return (
      <div>
        <div className="title">Téléchargez un fichier Excel vers Process Triggers</div>
        <br />
        <div className="c">
            <input type="file" className="inputfile" id="file" accept={SheetJSFT} onChange={this.handleChange} />
            <label htmlFor="file"> <img src={img1} alt="upload" className="img1"/> Choisir un fichier</label>
        </div>
        <br />
        {/*<input type='submit' 
          value="Process Triggers"
          onClick={this.handleFile} />*/}

          <div className="p">
            <button onClick={this.handleFile} >Process Triggers</button>
          </div>
          
          <table className='table table-hover mt-5'>
              <thead>
                  <tr>
                      <th>Names</th>
                  </tr>
              </thead>
              <tbody>
              {
                this.state.data.map((item,key)=>{
                    return(
                        <tr key={item.GeographyKey}>
                            <td>{item.ContinentName}</td>
                        </tr>
                    )
                })
                }
              </tbody>

          </table>
      </div>
    )
  }
}
