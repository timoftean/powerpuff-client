import React, {Component} from 'react'
import '../assets/index.css';
import {Operation} from '../Operation'
import {db} from '../config/constants'
import {Card, CardTitle, CardText, CardActions, Button, Textfield} from 'react-mdl'

class Temperature extends Component {
	constructor(props) {
		super(props)
		this.state={
			min: null,
			max: null,
			current: null,
			minEditing: false,
			maxEditing: false
		}
		this.ops = new Operation()
	}
	
	async componentDidMount() {
		this.ops.getTemperature().then(temp => {
			console.log(temp)
			this.setState({
				current: temp.current,
				min: temp.min,
				max: temp.max
			})
		})
		this.setTemperature()
	}
	
	setTemperature = async () => {
		const ref = db.ref("temperature")
		const self = this
		ref.on("child_changed", function(snapshot) {
			self.setState({current: snapshot.val()})
		})
	}
	
	saveTemp = async (e) => {
		e.preventDefault()
		const temp = {
			min: this.state.min,
			max: this.state.max
		}
		await this.ops.saveTemperature(temp)
		this.setState({
			minEditing: false,
			maxEditing: false
		})
	}
	
	handleMinEdit = () => {
		this.setState({
			minEditing: true
		})
	}
	
	handleMaxEdit = () => {
		this.setState({
			maxEditing: true
		})
	}
	
	renderMin = () => {
		return this.state.minEditing
			?<Textfield
				onBlur={this.saveTemp}
				pattern="-?[0-9]*(\.[0-9]+)?"
				error="Input is not a number!"
				label="Min temperature..."
				style={{width: '150px'}}
			  value={this.state.min}
			  onChange={(e) => this.setState({min: e.target.value})}
			/>
			:<Button
				raised
         accent
         ripple
         style={{width:'150px', backgroundColor: '#4154B2'}}
         onClick={this.handleMinEdit}>
						{this.state.min}
				</Button>
	}
	
	renderMax = () => {
		return this.state.maxEditing
			?<Textfield
				onBlur={this.saveTemp}
				pattern="-?[0-9]*(\.[0-9]+)?"
				error="Input is not a number!"
				label="Max temperature..."
				style={{width: '150px', textAlign: 'center'}}
			  value={this.state.max}
				onChange={(e) => this.setState({max: e.target.value})}
			/>
			:<Button raised
			         accent
			         ripple
			         style={{width:'150px', backgroundColor: '#4154B2'}}
			         onClick={this.handleMaxEdit}>
				{this.state.max}
			</Button>
	}
	
	renderSlider = () => {
		return (
		<Card shadow={0} style={{ width: '320px', height: '200px', margin: 'auto' }}>
			<CardTitle expand style={{ color: '#fff', background: '#FC4582' }}>Real time temperature</CardTitle>
			<CardText>
				<div className="slider" style={{background: 'linear-gradient(to right, blue, green, red)' }}>
					<div id="slidecontainer">
						<input type="range" min={this.state.min+5} max={this.state.max+5} value={this.state.current} className="slider" id="myRange"/>
					</div>
				</div>
				<div style={{textAlign:'center'}}>
					{this.state.current}°C
				</div>
			</CardText>
			<CardActions>
				{this.renderMin()}
				{this.renderMax()}
			</CardActions>
		</Card>
			
		)
	}
	
	render(){
		return (
			<div>
				{
					this.state.current
					?this.renderSlider()
					:null
				}
			</div>
		)
	}
}

export default Temperature