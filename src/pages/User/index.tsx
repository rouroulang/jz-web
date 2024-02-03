import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProDescriptionsItemProps,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Divider, message } from 'antd';
import React, { useRef, useState } from 'react';
import { request } from 'umi';
import CreateForm from '../../components/CreateForm';

const handleRemove = async (selectedRows: any) => {
  // const hide = message.loading('正在删除');
  if (!selectedRows) return true;

  try {
    if (Array.isArray(selectedRows)) {
      await request('/api/custom/batch/delete', {
        data: { ids: selectedRows.map(item => item.id).join(',') },
        method: 'POST',
      });
    } else {
      await request('/api/custom/delete', {
        data: { id: selectedRows.id },
        method: 'POST',
      });
    }
    // hide();
    message.success('删除成功');
    return true;
  } catch (error) {
    // hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList: React.FC<unknown> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<API.UserInfo[]>([]);
  const columns: ProDescriptionsItemProps<API.UserInfo>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '名称为必填项',
          },
        ],
      },
    },
    {
      title: '汇总',
      dataIndex: 'total',
      valueType: 'text',
      hideInForm: true,
      editable: false
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (text, record, _, action) => (
        <>
          <a
            onClick={() => {
              action?.startEditable?.(record.id);
            }}
          >
            编辑
          </a>
          <Divider type="vertical" />
          <a onClick={() => handleRemove(record)}>删除</a>
        </>
      ),
      onAfterRemove: () => { console.log(11) }
    },
  ];

  return (
    <PageContainer
      header={{
        title: '客户名单',
      }}
    >
      <ProTable<API.UserInfo>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="id"
        options={{ fullScreen: true, density: false }}
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            key="1"
            type="primary"
            onClick={() => handleModalVisible(true)}
          >
            新建
          </Button>,
        ]}
        request={async (params, sorter, filter) => {
          const { data, success } = await request('/api/custom/page', {
            data: { ...params, pageNo: params.current, pageSize: 1, custom: { name: params.name } },
            method: 'POST',
            sorter,
            filter,
          });
          return {
            data: data?.rows || [],
            success,
          };
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
        editable={{
          type: 'multiple',
          onSave: async (rowKey, params, row) => {
            await request('/api/custom/update', {
              data: params,
              method: 'POST',
            });
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              项&nbsp;&nbsp;
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}
      <CreateForm
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
      >
        <ProTable<API.UserInfo, API.UserInfo>
          onSubmit={async (value) => {
            const data = await request('/api/custom/insert', {
              data: { ...value },
              method: 'POST',
            });
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }}
          rowKey="id"
          type="form"
          columns={columns}
        />
      </CreateForm>
    </PageContainer>
  );
};

export default TableList;
