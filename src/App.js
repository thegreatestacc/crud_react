import './App.css';
import { Component } from 'react';
import { ProductService } from './service/ProductService';
import { DataTable } from 'primereact/datatable';
import { Colum } from 'primereact/column';
import { Panel } from 'primereact/panel';
import { Menubar } from 'primereact/menubar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';


import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      selectedProduct: {

      }
    };
    this.items = [
      {
        label: 'New',
        icon:'pi pi-fw pi-plus',
        command: () => {this.showSaveDialog()}
      },
      {
        label: 'Edit',
        icon:'pi pi-fw pi-pencil',
        command: () => {this.showEditDialog()}
      },
      {
        label: 'Delete',
        icon:'pi pi-fw pi-trash',
        command: () => {this.delete()}
      }
    ];
    this.productService = new ProductService();
    this.save = this.save.bind(this);
    this.delete = this.delete.bind(this);
    this.findByName = this.showFindByNameDialog.bind(this);
    this.footer = (
      <div>
        <Button label="Save" icon="pi pi-check" onClick={this.save}/>
      </div>
    )
  }

  componentDidMount() {
    this.productService.getAll().then(data => this.setState({products : data}))
    this.setState({
      visible: false,
      product: {
        id: null,
        name: null,
        description: null
      }
    });
  }

  save() {
    this.productService.save(this.state.product).then(data => {
      this.setState({
        visible: false,
        product: {
          id: null,
          name: null,
          description: null
        }
      });
      this.toast.show({severity: 'success', summary: 'Success Message', detail: 'New product saved!'});
      this.productService.getAll().then(data => this.setState({products: data}));
    });
  }

  delete() {
    if (window.confirm("Are you sure you want to delete the entry?")) {
      this.productService.delete(this.state.selectedProduct.id).then(data => {
        this.toast.show({severity: 'success', summary: 'Success Message', detail: 'Product deleted!'});
        this.productService.getAll().then(data => this.setState({products: data}));
      });
    }
  }

  render() {
    return(
      <div style={{width:'80%', marginTop: '20px', margin: '0 auto'}}>
        <Menubar model={this.items}/>
        <br/>
        <Panel header="Products" >
          <p>Here you can get full information about our products</p>
          
          <DataTable value={this.state.products} paginator={true} rows="5" selectionMode="single" selection={this.state.selectedProduct} onSelectionChange={e => this.setState({selectedProduct: e.value})}>
            <Colum field="id" header="ID"></Colum>
            <Colum field="name" header="Name"></Colum>
            <Colum field="description" header="Description"></Colum>
          </DataTable>
        </Panel>
        <Dialog header="Add new/edit product" visible={this.state.visible} style={{width: '400px'}} footer={this.footer} modal={true} onHide={() => this.setState({visible: false})}>
          <form id="product-form">
          <span className="p-float-label">
            <InputText style={{width: '100%'}} value={this.state.value} id="name" onChange={(e) => this.setState(prevState => {
                let val = e.target.value;
                let product = Object.assign({}, prevState.product)
                product.name = val;

                return{product};
              })} />
              <label htmlhtmlFor="name">Name</label>
          </span>
          <br/>
          <span className="p-float-label">
            <InputText style={{width: '100%'}} value={this.state.value} id="description" onChange={(e) => this.setState(prevState => {
                let product = Object.assign({}, prevState.product)
                product.description = e.target.value

                return{product};
              })} />
              <label htmlhtmlFor="description">Description</label>
          </span>
          </form>
        </Dialog>
        <Toast ref={(el) => this.toast = el} />
      </div>
    );
  }

  showSaveDialog() {
    this.setState({
      visible: true,
        product: {
          id: null,
          name: null,
          description: null
        }
    });
  }

  showEditDialog() {
    this.setState({
      visible: true,
      product: {
        id: this.state.selectedProduct.id,
        name: this.state.selectedProduct.name,
        description: this.state.selectedProduct.description
      }
    });
  }

  showFindByNameDialog() {
    this.setState({
      visible: true,
      product: {
        id: null,
        name: null,
      }
    });
  }
}