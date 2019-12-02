import React from 'react';
import './index.css';


function Next(props){
  function CreateItemStyle(x,y,color){
		let itemStyle = {};
		itemStyle.gridColumn = '' + y + '/'+(y+1);
		itemStyle.gridRow = '' + x +'/' + (x+1);
		itemStyle.backgroundColor = color;
		itemStyle.borderStyle = 'solid'
		itemStyle.borderWidth =  '8px'

		return itemStyle;
	}


	const containerStyle = {
		display : 'grid',
		gridTemplateColumns : 'repeat(4,48px)',
		gridTemplateRows : 'repeat(2,48px)'
	};

  let nextItemElement = props.piece.map((rowElem,indexI) => {
    const pieceElement = rowElem.map((cell,indexJ) => {
      let divElement;
      if(cell)
        divElement = <div style={CreateItemStyle(indexI + 1,indexJ + 1,'red')} key={indexI * 10 + indexJ} />;
      else {
         divElement = <div style={CreateItemStyle(indexI + 1,indexJ + 1,'black')} key={indexI * 10 + indexJ} />;
      }
      return divElement;
    })
    return pieceElement;
  })


  return(
    <div className="border">
    <h1 className="score">Next</h1>
    <div style={containerStyle}>
      {nextItemElement}
    </div>
    </div>
  )
}

export default Next;
