import React, { useState, useEffect } from "react";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import { CSVLink } from "react-csv";
import { formatDate, formatTime } from "../../utils/helper";
import styles from "./AlertDocumentationPage.module.scss";

import { Button, Form, Input, DatePicker, Table, Descriptions } from "antd";
import {
  DownloadOutlined,
  CloseOutlined,
  PlusOutlined,
  EditOutlined,
  SaveOutlined,
} from "@ant-design/icons";

const AlertDocumentationPage = () => {
  const { alertId } = useParams();
  const [incidents, setIncidents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [incidentDetails, setIncidentDetails] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editForm] = Form.useForm();

  useEffect(() => {
    const storedIncident = localStorage.getItem(`PPE Violation ${alertId}`);
    if (storedIncident) {
      setIncidentDetails(JSON.parse(storedIncident));
    }
  }, [alertId]);

  const onSubmit = (data) => {
    setIncidents([...incidents, { ...data, id: incidents.length + 1 }]);
    setShowForm(false);
  };

  const onEditSubmit = (data) => {
    const updatedIncident = { ...incidentDetails, ...data };
    setIncidentDetails(updatedIncident);
    localStorage.setItem(
      `PPE Violation ${alertId}`,
      JSON.stringify(updatedIncident)
    );
    setEditing(false);
  };

  const columns = [
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      render: (text) =>
        formatDate(new Date(text)) + " " + formatTime(new Date(text)),
    },
    {
      title: "Corrective Actions",
      dataIndex: "correctiveActions",
      key: "correctiveActions",
    },
  ];

  const generatePDF = () => {
    const doc = new jsPDF();
    let yOffset = 20;
    doc.text("Incident Reports", 20, 10);
    incidents.forEach((incident, index) => {
      doc.text(`Incident ${index + 1}:`, 20, yOffset);
      doc.text(`Description: ${incident.description}`, 20, yOffset + 10);
      doc.text(`Location: ${incident.location}`, 20, yOffset + 20);
      doc.text(
        `Time: ${formatDate(new Date(incident.time))} ${formatTime(
          new Date(incident.time)
        )}`,
        20,
        yOffset + 30
      );
      doc.text(
        `Corrective Actions: ${incident.correctiveActions}`,
        20,
        yOffset + 40
      );
      yOffset += 50;
    });
    doc.save("IncidentReports.pdf");
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.header}>Alert Documentation</h1>

        {incidentDetails && (
          <div className={styles.incidentContainer}>
            <div className={styles.incidentFrame}>
              <img
                src={`../../../backend/ModelService/resources/detected_frames/${incidentDetails.frame_url}`}
                alt="Incident Frame"
                className={styles.incidentImage}
              />
            </div>
            <div className={styles.incidentDetails}>
              <div className={styles.editIcon}>
                {editing ? (
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={() => editForm.submit()}
                    size="small"
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    type="default"
                    icon={<EditOutlined />}
                    onClick={() => {
                      setEditing(true);
                      editForm.setFieldsValue({
                        description: incidentDetails.json.description.line1,
                        event_type: incidentDetails.json.event_type,
                        violation_type: incidentDetails.json.violation_type,
                        frame: incidentDetails.json.frame,
                        severity_level: incidentDetails.json.severity_level,
                        location: incidentDetails.json.metadata.location,
                        time: incidentDetails.json.timestamp,
                      });
                    }}
                    size="small"
                  >
                    Edit
                  </Button>
                )}
              </div>
              {editing ? (
                <Form
                  form={editForm}
                  layout="vertical"
                  onFinish={onEditSubmit}
                  className={styles.editForm}
                >
                  <Form.Item
                    label="Description"
                    name="description"
                    rules={[
                      {
                        required: true,
                        message: "Please input the description!",
                      },
                    ]}
                  >
                    <Input.TextArea rows={4} />
                  </Form.Item>
                  <Form.Item
                    label="Event Type"
                    name="event_type"
                    rules={[
                      {
                        required: true,
                        message: "Please input the event type!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Violation Type"
                    name="violation_type"
                    rules={[
                      {
                        required: true,
                        message: "Please input the violation type!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Frame Number"
                    name="frame"
                    rules={[
                      {
                        required: true,
                        message: "Please input the frame number!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Severity Level"
                    name="severity_level"
                    rules={[
                      {
                        required: true,
                        message: "Please input the severity level!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Location"
                    name="location"
                    rules={[
                      { required: true, message: "Please input the location!" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Time"
                    name="time"
                    rules={[
                      { required: true, message: "Please select the time!" },
                    ]}
                  >
                    <DatePicker showTime />
                  </Form.Item>
                </Form>
              ) : (
                <>
                  <h2>Incident Details</h2>
                  <Descriptions bordered column={1} className={styles.details}>
                    <Descriptions.Item label="Description">
                      {incidentDetails.json.description.line1}
                    </Descriptions.Item>
                    <Descriptions.Item label="Event Type">
                      {incidentDetails.json.event_type}
                    </Descriptions.Item>
                    <Descriptions.Item label="Violation Type">
                      {incidentDetails.json.violation_type}
                    </Descriptions.Item>
                    <Descriptions.Item label="Frame Number">
                      {alertId}
                    </Descriptions.Item>
                    <Descriptions.Item label="Severity Level">
                      {incidentDetails.json.severity_level}
                    </Descriptions.Item>
                    <Descriptions.Item label="Location">
                      {incidentDetails.json.metadata.location}
                    </Descriptions.Item>
                    <Descriptions.Item label="Time">
                      {`${formatDate(
                        new Date(incidentDetails.json.timestamp)
                      )} ${formatTime(
                        new Date(incidentDetails.json.timestamp)
                      )}`}
                    </Descriptions.Item>
                  </Descriptions>
                </>
              )}
            </div>
          </div>
        )}

        <Button
          className={styles.createButton}
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setShowForm(true)}
          size="large"
        >
          Create Incident Report
        </Button>

        {showForm && (
          <div className={styles.formContainer}>
            <Form
              className={styles.form}
              layout="vertical"
              onFinish={onSubmit}
              size="large"
            >
              <Form.Item
                label="Description"
                name="description"
                rules={[
                  { required: true, message: "Please input the description!" },
                ]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>
              <Form.Item
                label="Location"
                name="location"
                rules={[
                  { required: true, message: "Please input the location!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Time"
                name="time"
                rules={[{ required: true, message: "Please select the time!" }]}
              >
                <DatePicker showTime />
              </Form.Item>
              <Form.Item
                label="Corrective Actions"
                name="correctiveActions"
                rules={[
                  {
                    required: true,
                    message: "Please input corrective actions!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <div className={styles.formButtons}>
                <Button
                  type="text"
                  icon={<CloseOutlined />}
                  onClick={() => setShowForm(false)}
                  size="large"
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  icon={<PlusOutlined />}
                >
                  Add Incident
                </Button>
              </div>
            </Form>
          </div>
        )}

        <h3
          style={{
            fontWeight: 400,
            fontSize: "3rem",
            textAlign: "center",
            margin: "2rem 0",
          }}
        >
          Incident Reports
        </h3>
        <div className={styles.tableContainer}>
          <Table
            columns={columns}
            dataSource={incidents}
            rowKey={(record) => record.id}
          />
        </div>

        <div className={styles.exportButtons}>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            size="large"
            onClick={generatePDF}
          >
            Download as PDF
          </Button>
          <Button type="primary" icon={<DownloadOutlined />} size="large">
            <CSVLink
              data={incidents}
              headers={columns.map((col) => ({
                label: col.title,
                key: col.dataIndex,
              }))}
            >
              Download as CSV
            </CSVLink>
          </Button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AlertDocumentationPage;
