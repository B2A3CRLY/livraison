import React from 'react'

export const CheckBox = props => {
    return (
      <tr>   
            <td>{props.id}</td>
            <td><input key={props.id} onClick={props.handleCheckChieldElement} type="checkbox" checked={props.isChecked} value={props.tracking_number} onChange={() => { }} /></td>
            <td>{props.tracking_number}</td>
            <td>{props.client.full_name}</td>
            <td>{props.client.phone}</td>
            <td>{props.weight}</td>
            <td>{props.status}</td>
            <td>{props.delivery_price}</td>
            <td>{props.date_creation}</td>
      </tr>
    )
}

export default CheckBox