
import * as React from 'react';
import FormItem from 'antd/lib/form/FormItem';
import { Icon,Col,AutoComplete} from 'antd';



class userEntityTree extends React.Component {
    constructor(props:any) {
        super(props);       
       
      }
     
    render() {
        return (
            <div>
                <div className="antd-row">
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 24 }}>
                        <FormItem>
                            <label>{'Search User Group'} <span className="start">*</span> </label>
                            <div className="rel">
                            <AutoComplete placeholder="Group 1/ Group 2/ Group 4"  >
                                                
                                            </AutoComplete>
                            {/* <Input /> */}
                                <div className="searchbtn"><Icon type="search" /> </div>
                            </div>
                        </FormItem>
                    </Col>
                </div>
                <div className="antd-row">
                    <div className="ant-col-lg-24 ant-col-sm-24 ant-col-md-24 ant-col-xs-24">
                        <div className="treedigram">
                            <ul className="tree">
                                <li className="mt0">
                                    <a className="fristlink"><span className="treeIcon"></span> <span className="">Cardinal Health </span> <span className="groupicon"></span><span className="values">4,923</span></a>
                                    <ul>
                                        <li>
                                            <a><span className="">Ball And Foodstores </span> <span className="groupicon"></span><span className="values">2,573</span></a>
                                            <ul>
                                                <li><a> <span className="">Pharmacy 5</span> <span className="groupicon"></span><span className="values">534</span></a>
                                                    <ul>
                                                        <li className="highlighted"><a><span className="">NCPDP 13</span> <span className="groupicon"></span><span className="values">15</span> <span className="adduserIcon"></span></a>
                                                        </li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                
            </div>

        );
    };
}

export default userEntityTree;

