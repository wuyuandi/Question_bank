import { Select, Drawer, Button, Collapse } from 'antd';
import React, {Component} from 'react'
import 'antd/dist/antd.css';
import './style.css'
import tagData from '../tagData.json'
import listData from '../data.json'
import _ from 'lodash';
import MathJax from 'react-mathjax-preview'

const { Option } = Select;


//type: array
//usage: getting all tags from the tagData.json
const tags = []
for (var key in tagData) {
    tags.push(key);
}
tags.sort()


// question Name 

const qLists = listData;


const q = []
for (var i in listData){
    q.push(i)
}




//collapse from ant-design
//usage: to show or fold the question text
const { Panel } = Collapse;

function callback(key) {
  console.log(key);
  
}

export default class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list:{},
            andTags: [],
            orTags: [],
            notTags: [],
            resultTags: []
            


        }
        this.andHandleChange = this.andHandleChange.bind(this);
        this.orHandleChange = this.orHandleChange.bind(this);
        this.notHandleChange = this.notHandleChange.bind(this);
    }

//type: array
//usage: loop the array 
    getTagsItems() {
        return tags.map((item) => {
            return (
                <Option key={item}>{item}</Option>
            )
        })
    }
    getQuestion = (id) => {
        //console.log('get', _.get(this.state.list,id.toString()))
        return _.get(this.state.list,id.toString())
    } 
    getQuestionItems() {
        const {andTags, orTags, notTags} = this.state;
       //console.log(this.state.list)
       let questions;
       if(_.isEmpty(andTags) && _.isEmpty(orTags) && _.isEmpty(notTags)) {
            questions = Object.values(this.state.list)
       }
       else {
           questions = _.map(this.state.resultTags,(id) => {
               return this.getQuestion(id)
           })

       }
        // let div = document.createElement("div");

        return _.map(questions,(item,index) =>{
            // let content = item.question.questiontext.text.replace(/<.+?>/g, '');
            // content = content.replace(/&nbsp;/ig,'');


            // div.innerHTML = item.question.questiontext.text;
            // const textA = div.textContent || div.innerText;
            // console.log(textA)
            return (
                <Panel header={item.question.name.text} key={index} >
                    <table className='questionTable'>
                    <tr>
                        <td className='questionText'>
                        <div>
                            <MathJax math={item.question.questiontext.text} />
                        </div>
                        
                        </td>
                        <td className='idAndTags'>
                            <div>
                                <p>id: {item.question.idnumber}</p>
                                <ul>Tags:{item.question.tags.tag.map((tag) =>
                                    <li key={tag.text}>{tag.text}</li>
                                )}
                                </ul>
                            </div>
                        </td>
                    </tr>
                    </table>
                </Panel>
            )
        })
    }

    
    state = { visible: false, placement: 'right' };

    showDrawer = () => {
    this.setState({
        visible: true,
    });
    };

    onClose = () => {
    this.setState({
        visible: false,
    });

    };

    onChange = e => {
    this.setState({
        placement: e.target.value,
    });
    };
    onFilter = () => {
        
        
        let andResult = _.reduce(this.state.andTags,(res,tag) => {
            //console.log(tagData[tag],res)
            if (_.isEmpty(res)) {
                res = tagData[tag]
            }
            return _.intersection(tagData[tag],res)

        },[])

        let orResult = _.reduce(this.state.orTags,(res,tag) => {
            //console.log(tagData[tag],res)
            if (_.isEmpty(res)) {
                res = tagData[tag]
            }
            return _.union(tagData[tag],res)

        },[])
        let notResult = _.reduce(this.state.notTags,(res,tag) => {
            if (_.isEmpty(res)) {
                res = tagData[tag]
            }
            return _.union(tagData[tag],res)
        },[])



        switch(true) {
            //only and 
            case (andResult.length !== 0 && orResult.length === 0  && notResult.length === 0):
                this.setState({
                    resultTags: andResult
                
                });
                console.log('Successfully get and')
                break;
            //only or
            case (andResult.length === 0 && orResult.length !== 0  && notResult.length === 0):

                this.setState({
                    resultTags: orResult
                
                });
                console.log('Successfully get or')
                break;
            //only not
            case (andResult.length === 0 && orResult.length === 0  && notResult.length !== 0):

                var notID = _.difference(q,notResult)
                this.setState({
                    resultTags: notID
                
                })
                console.log('Successfully get not',notID)
                break;
            //only and or
            case (andResult.length !== 0 && orResult.length !== 0  && notResult.length === 0):
                var andOrResult = _.intersection(andResult,orResult)
                this.setState({
                    resultTags: andOrResult
                
                });
                console.log('Successfully get And OR')
                break;
            //only and not
            case (andResult.length !== 0 && orResult.length === 0  && notResult.length !== 0):
                var andNotResult = _.difference(andResult,notResult)
                this.setState({
                    resultTags: andNotResult
                
                });
                console.log('Successfully get And not')
                break;
            //only or not
            case (andResult.length === 0 && orResult.length !== 0  && notResult.length !== 0):
                var orNotResult = _.difference(notResult,orResult)
                this.setState({
                    resultTags: orNotResult
                
                });
                console.log('Successfully get or not')
                break;
            //all three
            default:
                var andOr = _.intersection(andResult,orResult)
                var Result = _.difference(andOr,notResult)
                this.setState({
                    resultTags: Result
                
                });
                console.log('Successfully get All')
            
            
        }

        console.log("Output for andResult: ",andResult)
        console.log("Output for orResult: ",orResult)
        console.log("output for notResult:", notResult)
        console.log("All three Result: ", Result)
    }
//-----------------------------------------------------------------------    
    andHandleChange(value) {
        this.setState(()=>{
            return{
                andTags: value
            }

        },()=>{
            this.onFilter();
        });
    }
    orHandleChange(value) {
        
        this.setState({
            orTags: value

        },()=>{
            this.onFilter();
        });
        console.log(`orTags selected ${value}`);
    }
    notHandleChange(value) {
        this.setState({
            notTags: value

        },()=>{
            this.onFilter();
        });
        console.log(`notTags selected ${value}`);
    }
//--------------------------------------------------------------------------
    
    componentDidMount() {
        this.setState({
            list: qLists
        })
        
    }


    render() {
        const { placement, visible } = this.state;
        return (
        <React.Fragment>
            <Button
                className="button" 
                type="primary" 
                onClick={this.showDrawer}
                >
                Filter
            </Button>
            <Drawer
            title="Question Filter"
            placement={placement}
            width={720}
            closable={false}
            onClose={this.onClose}
            visible={visible}
            key={placement}
            >
                <div className="selectorWrapper">
                    AND Logic : (Question must have all of the chosen tags) e.g. Limit, Rn
                    <Select
                    
                    className="selector"
                    mode="tags"
                    style={{ width: '100%' }}
                    placeholder="Please select"
                    onChange={this.andHandleChange}
                    >
                    {this.getTagsItems()}
                    </Select>
                </div>
                <div className="selectorWrapper">
                    OR Logic : (Question must have at least one of chosen tags) e.g. Difficulty 1/10, Difficulty 2/10
                    <Select
                    
                    className="selector"
                    mode="tags"
                    style={{ width: '100%' }}
                    placeholder="Please select"
                    onChange={this.orHandleChange}
                    >
                    {this.getTagsItems()}
                    </Select>
                </div>
                <div className="selectorWrapper">
                    NOT Logic : (Question must not have any of chosen tags) e.g. Limit
                    <Select
                    
                    className="selector"
                    mode="tags"
                    style={{ width: '100%' }}
                    placeholder="Please select"
                    onChange={this.notHandleChange}
                    >
                    {this.getTagsItems()}
                    </Select>
                </div>

            </Drawer>
                <div className="collapseWrapper">
                <Collapse onChange={callback}>
                    {this.getQuestionItems()}
                    
                </Collapse>
                </div>

        </React.Fragment>
        )
    }
}

