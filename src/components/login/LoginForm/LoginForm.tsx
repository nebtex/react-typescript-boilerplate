import * as React from 'react';
import { Form, FormGroup, Label, Input, Card, CardBlock, TabContent, TabPane, Nav, NavItem, NavLink, Col, Row, Button } from 'reactstrap';
import * as classnames from 'classnames';
import UserPassForm from './UserPassForm';
import TokenForm from './TokenForm';
import GithubLogin from './GithubLogin';
import { LoginStatus } from '../../../api/api';
import SessionCounter from '../SessionCounter/SessionCounter';
import { observer } from 'mobx-react';
let styles = require('./LoginForm.scss');

export type ActiveTabType = 'UserPassTab' | 'TokenTab';

export interface ILoginFormProps {
  status?: LoginStatus;
  activeTab: ActiveTabType;
  toggleTab(tab?:ActiveTabType) : void;
  error?: string;
}

 @observer class LoginForm extends React.Component<ILoginFormProps, {}> {
  getActiveComponent = () => {
    const status = this.props.status;

    if (status.isLogged){
      return (
        <div className={styles.container}>
          <SessionCounter expiresAt={status.sessionExpiresAt}/>
            <Form action="/uilogout" method="post">
              <Button color="danger" className={styles.logout} >Logout</Button>
            </Form>
        </div>
      );
    } else {
      return (
        <div className={styles.container}>
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({ active: this.props.activeTab === 'UserPassTab' })}
                onClick={() => { this.props.toggleTab('UserPassTab'); }} >
                User/password
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: this.props.activeTab === 'TokenTab' })}
                onClick={() => { this.props.toggleTab('TokenTab'); }} >
                Token
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={this.props.activeTab}>
            <TabPane tabId="UserPassTab">
              <Card>
                <CardBlock>
                  <Row>
                    <Col md="5" style={{borderRight: "1px solid rgba(0,0,0,.125)"}}>
                      <GithubLogin error={this.props.error === 'Github'}/>
                    </Col>
                    <Col md="7">
                      <UserPassForm error={this.props.error === 'Username/Password'}/>
                    </Col>
                  </Row>  
                </CardBlock>
              </Card>
            </TabPane>
            <TabPane tabId="TokenTab">
              <TokenForm error={this.props.error === 'Token'}/>
            </TabPane>
          </TabContent>
        </div>
      );
    }
  };
 
  render(){
    let activeComponent = this.getActiveComponent();
    return activeComponent;
  }
}

export default LoginForm;