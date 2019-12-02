import React from 'react';


function Grid(props){

  function CreateItemStyle(x,y,color){
		let itemStyle = {};
		itemStyle.gridColumn = '' + y + '/'+(y+1);
		itemStyle.gridRow = '' + x +'/' + (x+1);
		itemStyle.backgroundColor = color;
		itemStyle.borderStyle = 'solid'
		itemStyle.borderWidth =  '6px';
    itemStyle.borderColor = 'black';

		return itemStyle;
	}


	const containerStyle = {
		display : 'grid',
		gridTemplateColumns : 'repeat(10,48px)',
		gridTemplateRows : 'repeat(20,48px)'
	};

	const gridElements = props.board.map((rowElem,indexI) => {
		const rowElements = rowElem.map((cell,indexJ) => {
			let divElement;
			if(cell)
			    divElement = <div style={CreateItemStyle(indexI + 1,indexJ + 1,'red')} key={indexI * 10 + indexJ} />;
			else {
				  divElement = <div style={CreateItemStyle(indexI + 1,indexJ + 1,'blue')} key={indexI * 10 + indexJ} />;
			}
			return (
				divElement
			);
		})
		return rowElements;
	})


	return(
		<div className="container" style={containerStyle}>
		  {gridElements}
		</div>
	);
}

export default Grid;
