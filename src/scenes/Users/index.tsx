import * as React from 'react';

import { Button, Card, Col, Dropdown, Input, Menu, Modal, Row, Table, Tag, Icon  } from 'antd';
import { inject, observer } from 'mobx-react';
import CreateOrUpdateUser from './components/createOrUpdateUser';
import { EntityDto } from '../../services/vmodel/entityDto';

import Stores from '../../stores/storeIdentifier';
import UserStore from '../../stores/userStore';

export interface IUserProps {
    userStore: UserStore;
}

export interface IUserState {
    modalVisible: boolean;
    maxResultCount: number;
    skipCount: number;
    userId: number;
    filter: string;
}

const confirm = Modal.confirm;
const Search = Input.Search;

@inject(Stores.UserStore)
@observer
class User extends React.Component<IUserProps, IUserState> {
    formRef: any;

    state = {
        modalVisible: false,
        maxResultCount: 10,
        skipCount: 0,
        userId: 0,
        filter: '',
    };

    async componentDidMount() {
        await this.getAll();
    }

    async getAll() {
        await this.props.userStore.getAll({ maxResultCount: this.state.maxResultCount, skipCount: this.state.skipCount, keyword: this.state.filter });
    }

    handleTableChange = (pagination: any) => {
        this.setState({ skipCount: (pagination.current - 1) * this.state.maxResultCount! }, async () => await this.getAll());
    };

    Modal = () => {
        this.setState({
            modalVisible: !this.state.modalVisible,
        });
    };

    async createOrUpdateModalOpen(entityDto: EntityDto) {
        if (entityDto.id === 0) {
            await this.props.userStore.createUser();
            await this.props.userStore.getRoles();
        } else {
            await this.props.userStore.get(entityDto);
            await this.props.userStore.getRoles();
        }

        this.setState({ userId: entityDto.id });
        this.Modal();

        this.formRef.props.form.setFieldsValue({ ...this.props.userStore.editUser, roleNames: this.props.userStore.editUser.roleNames });
    }

    delete(input: EntityDto) {
        const self = this;
        confirm({
            title: 'Do you Want to delete these items?',
            onOk() {
                self.props.userStore.delete(input);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    handleCreate = () => {
        const form = this.formRef.props.form;

        form.validateFields(async (err: any, values: any) => {
            if (err) {
                return;
            } else {
                if (this.state.userId === 0) {
                    await this.props.userStore.create(values);
                } else {
                    await this.props.userStore.update({ id: this.state.userId, ...values });
                }
            }

            await this.getAll();
            this.setState({ modalVisible: false });
            form.resetFields();
        });
    };

    saveFormRef = (formRef: any) => {
        this.formRef = formRef;
    };

    handleSearch = (value: string) => {
        this.setState({ filter: value }, async () => await this.getAll());
    };

    public render() {

        const { users } = this.props.userStore;       

        const columns = [
            { title: 'FirstName', dataIndex: 'firstName', key: 'firstName', width: 150, render: (text: string) => <div>{text}</div> },
            { title: 'LastName', dataIndex: 'lastName', key: 'lastName', width: 150, render: (text: string) => <div>{text}</div> },
            { title: 'UserType', dataIndex: 'userType', key: 'userType', width: 150, render: (text: string) => <div>{text}</div> },
            { title: 'Department', dataIndex: 'department', key: 'department', width: 150, render: (text: string) => <div>{text}</div> },
            { title: 'EmailAddress', dataIndex: 'emailAddress', key: 'emailAddress', width: 150, render: (text: string) => <div>{text}</div> },
            {
                title: 'IsActive',
                dataIndex: 'isActive',
                key: 'isActive',
                width: 150,
                render: (text: boolean) => (text === true ? <Tag color="#2db7f5">{'Yes'}</Tag> : <Tag color="red">{'No'}</Tag>),
            },
            {
                title: 'Actions',
                width: 150,
                render: (text: string, item: any) => (
                    <div>
                        <Dropdown
                            trigger={['click']}
                            overlay={
                                <Menu>
                                    <Menu.Item onClick={() => this.createOrUpdateModalOpen({ id: item.id })}> <Icon type="edit" /> <span>{ 'Edit'}</span></Menu.Item>
                                    <Menu.Item onClick={() => this.delete({ id: item.id })}><Icon type="delete" /><span>{' Delete'}</span></Menu.Item>
                                </Menu>
                            }
                            placement="bottomLeft"
                        >
                            {/* <Button type="primary" icon="setting">
                                {'Actions'}
                            </Button> */}

                            <Icon type="ellipsis"/>

                            
                        </Dropdown>
                    </div>
                ),
            },
        ];

        return (
            <Card>
                <Row>
                    <Col
                        xs={{ span: 4, offset: 0 }}
                        sm={{ span: 4, offset: 0 }}
                        md={{ span: 4, offset: 0 }}
                        lg={{ span: 2, offset: 0 }}
                        xl={{ span: 2, offset: 0 }}
                        xxl={{ span: 2, offset: 0 }}
                    >
                        {' '}
                        <h2>{'Users'}</h2>
                    </Col>
                    <Col
                        xs={{ span: 14, offset: 0 }}
                        sm={{ span: 15, offset: 0 }}
                        md={{ span: 15, offset: 0 }}
                        lg={{ span: 1, offset: 21 }}
                        xl={{ span: 1, offset: 21 }}
                        xxl={{ span: 1, offset: 21 }}
                    >
                        <Button type="primary" shape="circle" icon="plus" onClick={() => this.createOrUpdateModalOpen({ id: 0 })} />
                    </Col>
                </Row>
                <Row>
                    <Col sm={{ span: 10, offset: 0 }}>
                        <Search placeholder={'Filter'} onSearch={this.handleSearch} />
                    </Col>
                </Row>
                <Row style={{ marginTop: 20 }}>
                    <Col
                        xs={{ span: 24, offset: 0 }}
                        sm={{ span: 24, offset: 0 }}
                        md={{ span: 24, offset: 0 }}
                        lg={{ span: 24, offset: 0 }}
                        xl={{ span: 24, offset: 0 }}
                        xxl={{ span: 24, offset: 0 }}
                    >
                        <div className="table-responsive">
                            <Table
                                rowKey={record => record.id.toString()}
                                size={'default'}
                                bordered={true}
                                columns={columns}
                                pagination={{ size:'small', pageSize: 10, total: users === undefined ? 0 : users.totalCount, defaultCurrent: 1 }}
                                loading={users === undefined ? true : false}
                                dataSource={users === undefined ? [] : users.items}
                                onChange={this.handleTableChange}
                                className="table"
                            />
                        </div>
                    </Col>
                </Row>
                <CreateOrUpdateUser
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.modalVisible}
                    onCancel={() =>
                        this.setState({
                            modalVisible: false,
                        })
                    }
                    modalType={this.state.userId === 0 ? 'edit' : 'create'}
                    onCreate={this.handleCreate}
                    roles={this.props.userStore.roles}
                />
            </Card>
        );
    }
}

export default User;
