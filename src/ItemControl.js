import React from 'react';
import NewItemForm from './NewItemForm.js';
import ItemList from './ItemList.js';
import ItemDetail from './ItemDetail';
import EditItemForm from './EditItemForm';
import { connect } from 'react-redux'; 
import { act } from 'react-dom/test-utils';
import PropTypes from "prop-types";



class ItemControl extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedItem: null,
      editing: false
    };
  }

  handleClick = () => {
    if (this.state.selectedItem !== null) {
      this.setState({
        selectedItem: null,
        editing: false
      });
    } else {
      const { dispatch } = this.props;
      const action = {
        type: 'TOGGLE_FORM'
      }
      dispatch(action);
    }
  }

  handleEditClick = () => {
    this.setState({editing: true});
  }

  handleEditingItemInList = (itemToEdit) => {
    const { dispatch } = this.props;
    const { id, quantity, name, description } = itemToEdit;
    const action = {
      type: 'ADD_ITEM',
      id: id,
      quantity: quantity,
      name: name, 
      description: description
    }
    dispatch(action);
    this.setState({
      editing: false,
      selectedItem: null
    });
    console.log(this.props.masterItemList)
  }


  handleItemPurchase = (id) => {
   const { dispatch } = this.props;
   const currentlySelectedItem = Object.values(this.props.masterItemList).filter(item => item.id === id)[0];
   const action = {
     type: 'ADD_ITEM',
     id: id,
     quantity: currentlySelectedItem.quantity - 1,
     name: currentlySelectedItem.name,
     description: currentlySelectedItem.description
   }
    dispatch(action);
    this.setState({selectedItem: null});
  }

  handleItemRestock = (id) => {
    const { dispatch } = this.props;
    const currentlySelectedItem = Object.values(this.props.masterItemList).filter(item => item.id === id)[0];
    const action = {
      type: 'ADD_ITEM',
      id: id,
      quantity: currentlySelectedItem.quantity + 10,
      name: currentlySelectedItem.name,
      description: currentlySelectedItem.description
    }
     dispatch(action);
     this.setState({selectedItem: null});
   }

  handleDeletingItem = (id) => {
    const { dispatch } = this.props;
    const action = {
      type: 'DELETE_ITEM',
      id: id
    }
    dispatch(action);
    this.setState({selectedItem: null});
  }

  handleChangingSelectedItem = (id) => {
    const selectedItem = this.props.masterItemList[id];
    this.setState({selectedItem: selectedItem});
  }

  handleAddingNewItemToList = (newItem) => {
    const { dispatch } = this.props;
    const { id, name, description, quantity } = newItem;
    const action = {
      type: 'ADD_ITEM',
      id: id,
      name: name,
      description: description,
      quantity: quantity,
    }
    dispatch(action);
    const action2 = {
      type: 'TOGGLE_FORM'
    }
    dispatch(action2);
    }
  

  render(){

    const itemControlStyles = {
      position: 'relative',
      top: '30vh',
      margin: '2%',
      overflowY: 'auto'
    }

    let currentlyVisibleState = null;
    let buttonText = null;
    
    if (this.state.editing) {
      currentlyVisibleState = <EditItemForm 
        item = {this.state.selectedItem}
        onEditItem = {this.handleEditingItemInList} />
      buttonText = "return to items";
    } else if (this.state.selectedItem != null) {
      currentlyVisibleState = <ItemDetail 
        item = {this.state.selectedItem} 
        onClickingDelete = {this.handleDeletingItem}
        onClickingEdit = {this.handleEditClick} />
      buttonText = "return to items";
    } else if (this.props.formVisibleOnPage) {
      currentlyVisibleState = <NewItemForm 
        onNewItemCreation={this.handleAddingNewItemToList}/>
      buttonText = "return to items";
    } else {
      currentlyVisibleState = <ItemList 
        itemList={this.props.masterItemList}
        onItemSelection={this.handleChangingSelectedItem}
        onClickingBuy={this.handleItemPurchase}
        onClickingRestock={this.handleItemRestock} />
      buttonText = "+";
    }

    return (
      <React.Fragment>
        <div style={itemControlStyles}>
          <div className="adjustableButton">
            <button onClick={this.handleClick}>{buttonText}</button>
          </div>
          <div className="storeFront">
            {currentlyVisibleState}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

ItemControl.propTypes = {
  masterItemList: PropTypes.object
};

const mapStateToProps = state => {
  return {
   masterItemList: state.masterItemList,
   formVisibleOnPage: state.formVisibleOnPage
  }
}

ItemControl = connect(mapStateToProps)(ItemControl);

export default ItemControl;