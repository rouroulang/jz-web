import services from '@/services/demo';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProTable,
  ModalForm,
  ProForm,
  ProFormMoney,
  ProFormDateTimePicker,
  ProFormText,
  ProFormDigit,
} from '@ant-design/pro-components';
import { useModel, request } from 'umi';
import { Button, Divider, Drawer, message } from 'antd';
import React, { useRef, useState } from 'react';
import PrintJs from 'print-js'
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas'
import './index.less'
import CreateForm from '../../components/CreateForm';
import UpdateForm, { FormValueType } from '../../components/UpdateForm';

const { addUser, queryUserList, deleteUser, modifyUser } =
  services.UserController;



const HomePage: React.FC = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<API.UserInfo[]>([]);
  const { initialState: { isMobile } } =
    useModel('@@initialState');
  const columns: ProDescriptionsItemProps<API.UserInfo>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      tip: '名称是唯一的 key',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '名称为必填项',
          },
        ],
      },
      fixed: 'left',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      valueType: 'date',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            startTime: new Date(value[0]).getTime(),
            endTime: new Date(value[1]).getTime(),
          };
        },
      },
    },
    {
      title: '规格',
      dataIndex: 'specification',
      key: 'specification',
      hideInSearch: true,
    },
    {
      title: '种类',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      valueType: 'digit',
      hideInSearch: true,
    },
    {
      title: '单价',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      valueType: 'digit',
      hideInSearch: true,
    },
    {
      title: '优惠',
      dataIndex: 'discount',
      key: 'discount',
      valueType: 'digit',
      hideInSearch: true,
    },
    {
      title: '总额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      hideInForm: true,
      valueType: 'digit',
      editable: false,
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      render: (text, record, _, action) => (
        <>
          <a
            onClick={() => {
              setStepFormValues(record);
              handleModalVisible(true);
            }}
          >
            编辑
          </a>
          <Divider type="vertical" />
          <a onClick={() => handleRemove(record)}>删除</a>
        </>
      ),
    },
  ];

  const handleRemove = async (selectedRows: API.UserInfo[]) => {
    // const hide = message.loading('正在删除');
    if (!selectedRows) return true;
    try {
      if (Array.isArray(selectedRows)) {
        await request('/api/record/batch/delete', {
          data: { ids: selectedRows.map(item => item.id) },
          method: 'POST',
        });
      } else {
        await request('/api/record/delete', {
          data: { id: selectedRows.id },
          method: 'POST',
        });
      }
      actionRef.current?.reloadAndRest?.();
      // hide();
      message.success('删除成功');
      return true;
    } catch (error) {
      // hide();
      message.error('删除失败，请重试');
      return false;
    }
  };

  const getpdf = () => {
    const html = document.getElementById("print");
    html2canvas(html, { backgroundColor: '#fff', useCORS: true }).then((canvas) => { // 获取图片
      const dataURL = canvas.toDataURL('image/png')
      // console.log(canvas) // 生成的图片
      // console.log(dataURL) // 生成的图片

      // PrintJs({
      //   printable: '',
      //   type: 'pdf',
      //   showModal: true,
      //   base64: true,
      // })
      var contentWidth = canvas.width
      var contentHeight = canvas.height
      // 一页pdf显示html页面生成的canvas高度;
      var pageHeight = (contentWidth / 592.28) * 841.89
      // 未生成pdf的html页面高度
      var leftHeight = contentHeight
      // 页面偏移
      var position = 0
      // a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
      var imgWidth = 595.28
      var imgHeight = (595.28 / contentWidth) * contentHeight
      var pageData = canvas.toDataURL('image/jpeg', 1.0)
      var pdf = new jsPDF('', 'pt', 'a4')
      // 有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
      // 当内容未超过pdf一页显示的范围，无需分页
      if (leftHeight < pageHeight) {
        // 在pdf.addImage(pageData, 'JPEG', 左，上，宽度，高度)设置在pdf中显示；
        pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
        // pdf.addImage(pageData, 'JPEG', 20, 40, imgWidth, imgHeight);
      } else {
        // 分页
        while (leftHeight > 0) {
          pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
          leftHeight -= pageHeight
          position -= 841.89
          // 避免添加空白页
          if (leftHeight > 0) {
            pdf.addPage()
          }
        }
      }
      pdf.save('订单列表')
    })
  }

  if (isMobile) {
    return 1
  }

  return (
    <PageContainer
      header={{
        title: '货物列表',
      }}

    >
      <ProTable<API.UserInfo>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="id"
        options={{ fullScreen: true, density: false }}
        scroll={{ x: 1500 }}
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            key="1"
            type="primary"
            onClick={() => {
              setStepFormValues({});
              handleModalVisible(true)
            }}
          >
            新建
          </Button>,
          // <Button
          //   key="1"
          //   type="primary"
          //   onClick={() => {
          //     getpdf()
          //     // const pdf = new jsPDF('p', 'pt', 'letter');
          //     // const html = document.getElementById("print").innerHTML;
          //     // pdf.html(html, {
          //     //   callback: () => {
          //     //     pdf.save("export.pdf");
          //     //   }
          //     // });
          //   }}
          // >
          //   PDF
          // </Button>,
          <Button
            type="primary"
            onClick={() => {
              PrintJs({
                printable: 'print',
                type: 'html',
                scanStyles: false,
              })
            }}
          >
            打印
          </Button>
        ]}
        request={async (params, sorter, filter) => {
          console.log(params)
          const { current, pageSize, name, category, startTime, endTime } = params
          const { data, success } = await request('/api/record/page', {
            data: { pageNo: current, pageSize, record: { name, category }, startTime, endTime },
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
      <ModalForm
        title={stepFormValues ? "编辑货物单" : "新增货物单"}
        open={createModalVisible}
        modalProps={{ destroyOnClose: true }}
        onOpenChange={handleModalVisible}
        initialValues={stepFormValues}
        onFinish={async (values) => {
          if (stepFormValues.id) {
            await request('/api/record/update', {
              data: { ...values, id: stepFormValues.id },
              method: 'POST',
            });
          } else {
            await request('/api/record/insert', {
              data: { ...values },
              method: 'POST',
            });
          }
          handleModalVisible(false);
          if (actionRef.current) {
            actionRef.current.reload();
          }
        }}
      >
        <ProForm.Group>
          <ProFormText
            width="md"
            name="name"
            label="名称"
            tooltip="最长为 24 位"
            placeholder="请输入名称"
          />
          <ProFormText
            width="md"
            name="specification"
            label="规格"
            tooltip="最长为 24 位"
            placeholder="请输入名称"
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormDigit
            width="md"
            name="quantity"
            label="数量"
            tooltip="最长为 24 位"
          />
          <ProFormText
            width="md"
            name="category"
            label="种类"
            placeholder="请输入名称"
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormMoney
            width="md"
            name="unitPrice"
            label="单价"
            placeholder="请输入名称"
          />
          <ProFormMoney
            width="md"
            name="discount"
            label="优惠"
            placeholder="请输入名称"
          />
        </ProForm.Group>
      </ModalForm>
      <div id="print" style={{ width: '100%' }}>
        <h1 style={{ textAlign: 'center', margin: '20px 0' }}>销售订单</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          <div style={{ width: '33%', marginBottom: 10 }}>制单人：1111</div>
          <div style={{ width: '33%', marginBottom: 10 }}>录单日期：1111</div>
          <div style={{ width: '33%', marginBottom: 10 }}>单据编号：1111</div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }} border={1}>
          <thead style={{ backgroundColor: '#dddddd' }}>
            <tr>
              <th>存货编号</th>
              <th>存货名称</th>
              <th>单位</th>
              <th>数量</th>
              <th>单价</th>
              <th>金额</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>111</th>
              <th>111</th>
              <th>111</th>
              <th>111</th>
              <th>111</th>
              <th>111</th>
            </tr>
            <tr>
              <th>合计</th>
              <th colSpan={5}>1111</th>
            </tr>
          </tbody>
        </table>
      </div>
    </PageContainer>
  );
};

export default HomePage;

