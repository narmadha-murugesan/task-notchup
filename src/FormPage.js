import React, { Component } from 'react';
import axios from 'axios';
import Dropdown from 'react-dropdown';
import './FormPage.css';

class FormPage extends Component {
    constructor() {
    	super();
        this.state = {
            myArray : [],
            dayArray : [],
            timeArray : [],
            timeOfDate : [],
            date : '',
            time : '',
            course : '',
            email : '',
            p_name : '',
            p_number : '',
            c_name : '',
            age : '',
            errors : {},
            responsed : [],
            submit : ''
             }
                this.handleDate = this.handleDate.bind(this);
                this.handleTime = this.handleTime.bind(this);
                this.grabData = this.grabData.bind(this);
                this.handleChanges = this.handleChanges.bind(this);
                this.handleFieldChange = this.handleFieldChange.bind(this);
                this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    componentDidMount() {
      this.grabData()
    }

    grabData = async () => {
      let myArray = []
      const apiUrl = 'https://script.google.com/macros/s/AKfycbzJ8Nn2ytbGO8QOkGU1kfU9q50RjDHje4Ysphyesyh-osS76wep/exec';
      let suggestionFetch = await fetch(apiUrl)
      let suggestionData = await suggestionFetch.json()   
      suggestionData.map( function(data) {
        myArray.push(data.course_name)
      });
      this.setState({myArray : myArray, responsed : suggestionData})
    }
    

    handleChanges = (e) => {
      let dayArray = []
      let timeArray = []
      let timeObj ={}
      this.state.responsed.map( function(data) {
        if(data.course_name == e.value){
          data.slots.map( function (slots) {
            let d = new Date(parseInt(slots.slot));
            let dn = new Date();
            let correctMin = "0" + d.getMinutes()
            let timeFromApi = d.getHours() + ':' + correctMin.substr(-2)
            let correctMonth = ( d.getMonth() < 12 ? d.getMonth() + 1 : 1 )
            let dateFromApi = d.getDate() + '-' + correctMonth  + '-' + d.getFullYear()  
            var diff =(d.getTime() - dn.getTime()) / 1000;
            diff /= 60;
            let dateTime = d.getDate() + '-' + correctMonth  + '-' + d.getFullYear()  +' '+ d.getHours() + ':' + correctMin.substr(-2)
            timeArray.push(dateTime)
            if (Math.round(diff) > 40 && Math.round(diff) < 10080){
              if(dayArray.indexOf(dateFromApi) == -1){
                dayArray.push(dateFromApi)
              }
            }
          });
        } 
      });
      this.setState({course : e.value ,dayArray : dayArray, timeArray : timeArray})
    }
    
    handleDate = (e) => {
      let timeOfDate = []
      let d = new Date();
      let correctMonth = ( d.getMonth() < 12 ? d.getMonth() + 1 : 1 )
      let dateToday = d.getDate() + '-' + correctMonth  + '-' + d.getFullYear() 
      this.state.timeArray.map( function(time){
        let splitTime = time.split(" ")
        if(! (splitTime[0] === dateToday && (splitTime[1].split(":")[0] - d.getHours() <= 4) )){
          if(e.value === splitTime[0]){
            timeOfDate.push(splitTime[1])
          }
        }
      })
      this.setState({date : e.value, timeOfDate : timeOfDate})
    }

    handleFieldChange = (e) => {
      let hasNumber = /\d/;
      let targetValue = e.target.value
      let values = e.target.name
      if (values === 'email'){
        const pattern = /[a-zA-Z0-9]+[\.]?([a-zA-Z0-9]+)?[\@][a-z]{3,9}[\.][a-z]{2,5}/g;
        const result = pattern.test(targetValue);
        if (result === true) {
          this.state.errors.email = '';
        } else {
          this.state.errors.email = 'Please enter correct email format';
        }
          this.setState({email : targetValue})
      }
      if (values === 'p_name'){
        if ( hasNumber.test(targetValue) === false) {
          this.state.errors.p_name = '';
          }
        else{
            this.state.errors.p_name = 'Please enter only alphabets';
          }
          this.setState({p_name : targetValue})
      }
      if (values === 'c_name'){
        if ( hasNumber.test(targetValue) === false) {
          this.state.errors.c_name = '';
        }
        else{
            this.state.errors.c_name = 'Please enter only alphabets';
        }
        this.setState({c_name : targetValue})
      }
      if (values === 'p_number'){
        if ( isNaN(targetValue) === false && (targetValue).length === 10) {
          this.state.errors.p_number = '';
        }
        else{
            this.state.errors.p_number = 'Please enter 10 digit number';
        }
        this.setState({p_number : targetValue})
      }
      if (values === 'age'){
        if ( isNaN(targetValue) === false && (targetValue).length <=2) {
          this.state.errors.age = '';
        }
        else{
          this.state.errors.age = 'Please enter only number';
        }
          this.setState({age : targetValue})
      }
      this.setState({errors : this.state.errors})
    }

    handleTime(e){
      this.setState({time : e.value})
    }

    handleSubmit() {
      let mailUrl = ''
      let local =this.state.errors
      if (local.email === '' && local.p_name === '' && local.c_name === '' && local.age === '' && local.p_number === '' && this.state.course !== '' && this.state.time !== '' && this.state.date !== ''){
      const body = { "email": this.state.email ,
                    "p_name": this.state.p_name, 
                    "c_name" : this.state.c_name, 
                    "time" : this.state.time
                    };
        axios.post('https://notchup-backend.herokuapp.com/email', body)
            .then(response => {
              mailUrl = response.data
              this.setState({submit : 'Url to check mail : ' + mailUrl })
              this.setState({
              date : '',
              time : '',
              course : '',
              email : '',
              p_name : '',
              p_number : '',
              c_name : '',
              age : ''
      });
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
      } else {
      this.setState({submit : 'Enter the form correctly'})}
    }


    render() {
        return(
            <div className="App"> 
            <div className = "headingform"> APPLICATION FORM </div>
               <div><input className="field" type="text" name="p_name" value = {this.state.p_name} onChange = {this.handleFieldChange} placeholder="Parents name"  /></div>
                        <span style={{ color: 'brown', fontSize: 'calc(11px + 1vmin)'  }}>{this.state.errors.p_name}</span>

               <div><input className="field" type="text" name="p_number" value = {this.state.p_number} onChange = {this.handleFieldChange} placeholder="Parents contact number" /></div>
                        <span style={{ color: 'brown', fontSize: 'calc(11px + 1vmin)'   }}>{this.state.errors.p_number}</span>

               <div><input className="field" type="text" name="email" value = {this.state.email} onChange = {this.handleFieldChange} placeholder="Parents Email Id" /></div>
              <span style={{ color: 'brown', fontSize: 'calc(11px + 1vmin)'   }}>{this.state.errors.email}</span>

               <div><input className="field" type="text" name="c_name" value = {this.state.c_name} onChange = {this.handleFieldChange} placeholder="Child's name" /></div>
              <span style={{ color: 'brown', fontSize: 'calc(11px + 1vmin)'   }}>{this.state.errors.c_name}</span>

              <div><input className="field" type="text" name="age" value = {this.state.age} onChange = {this.handleFieldChange} placeholder="Child's Age" /></div>
                      <span style={{ color: 'brown', fontSize: 'calc(11px + 1vmin)'   }}>{this.state.errors.age}</span>


                <div className = "ddalignmain">

<div><Dropdown placeholderClassName='myPlaceholderClassName'  menuClassName='myMenuClassName' className="ddfield" options={this.state.myArray} onChange = {this.handleChanges} placeholder=" Select a course" /></div>
<div><Dropdown placeholderClassName='myPlaceholderClassName'  menuClassName='myMenuClassName' className="ddfield" options={this.state.dayArray} value ={this.state.date} onChange = {this.handleDate} placeholder="Select an date" /></div>
<div><Dropdown placeholderClassName='myPlaceholderClassName'  menuClassName='myMenuClassName' className="ddfield" options={this.state.timeOfDate} value ={this.state.time} onChange = {this.handleTime} placeholder="Select an slot" /></div>
</div>
  <div><button className ='buttonSubmit' onClick={this.handleSubmit}> Submit</button></div>

  <div className ='displayLink' >{this.state.submit}</div>

            </div>
            );
    }
}

export default FormPage;
