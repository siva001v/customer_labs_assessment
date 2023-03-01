import React, { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap';
import { Formik } from 'formik';
import { IoIosRemoveCircleOutline } from 'react-icons/io';

export default function AddSegmentModal(props) {

    let { showModal, setShowModal } = props;

    const initialValue = {
        'nameOfTheSegment': '',
        'addSchema': ''
    };

    const [errorMessage, setErrorMessage] = useState('');

    const [selectOptions, setSelectOptions] = useState([
        {
            value: "first_name",
            label: 'First Name'
        },
        {
            value: "last_name",
            label: 'Last Name'
        },
        {
            value: "gender",
            label: 'Gender'
        },
        {
            value: "age",
            label: 'Age'
        },
        {
            value: "account_name",
            label: 'Account Name'
        },
        {
            value: "city",
            label: 'City'
        },
        {
            value: 'state',
            label: 'State'
        }
    ]);

    const [addedSchemas, setAddedSchemas] = useState([]);

    const handleClose = () => {
        setShowModal(false);
    }

    const onSubmit = (values) => {
        if (values.nameOfTheSegment !== '' && addedSchemas.length > 0) {
            let payload = {
                "segment_name": values.nameOfTheSegment,
                "schema": []
            }
            addedSchemas.map((item) => {
                let tempObject = {};
                tempObject[item.value] = item.label
                payload.schema.push(tempObject);
            });
            let url = 'https://webhook.site/4dcee989-6c5f-42b9-aa92-f6023df1926f' + '?payload=' + encodeURIComponent(JSON.stringify(payload))
            fetch(url, {
                method: "GET"
            }).then((res) => {
                handleClose();
            })
        }
        else {
            setErrorMessage('Enter the name of the segment and select the schmea');
            setTimeout(() => {
                setErrorMessage('');
            }, 3000)
        }
    }

    const addNewSchema = (setFieldValue, values) => {
        let tempAddedSchemas = addedSchemas;
        let tempSelectOptions = [];
        selectOptions.map((item) => {
            if (item.value == values.addSchema) {
                tempAddedSchemas.push(item);
            }
            else {
                tempSelectOptions.push(item);
            }
        })
        setFieldValue('addSchema', '');
        setAddedSchemas([...tempAddedSchemas]);
        setSelectOptions([...tempSelectOptions]);
    }

    const changeBlueContainterDropdown = (event, index) => {
        let previousValue = addedSchemas[index];
        let tempAddedSchemas = addedSchemas;
        let tempSelectOptions = selectOptions;
        selectOptions.map((item, inx) => {
            if (item.value == event.target.value) {
                tempAddedSchemas[index] = item;
                tempSelectOptions.splice(inx, 1)
            }
        })
        tempSelectOptions.push(previousValue);
        setAddedSchemas([...tempAddedSchemas]);
        setSelectOptions([...tempSelectOptions]);
    }

    const removeSelectedSchema = (index) => {
        let removedValue = addedSchemas[index];
        let tempAddedSchemas = addedSchemas;
        let tempSelectOptions = selectOptions;
        tempAddedSchemas.splice(index, 1)
        tempSelectOptions.push(removedValue);
        setAddedSchemas([...tempAddedSchemas]);
        setSelectOptions([...tempSelectOptions]);
    }

    return (
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Saving Segment</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik initialValues={initialValue} onSubmit={onSubmit}>
                    {({ values, errors, handleSubmit, handleChange, setFieldValue }) => {
                        return (
                            <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Enter the name of the Segment</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="nameOfTheSegment"
                                        placeholder="Name of the segment"
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <p className='my-4'>To save your segment, you need to add the schemas to build the query</p>
                                {
                                    addedSchemas.length > 0 && (
                                        <div className='blue-container'>
                                            {
                                                addedSchemas.map((item, index) => (
                                                    <div className='group' key={`sub-select-${index.toString()}`}>
                                                        <Form.Select className="mb-3" aria-label="Default select example" name={`Schema-${index.toString()}`}
                                                            onChange={(e) => changeBlueContainterDropdown(e, index)} value={item.value}>
                                                            <option value={item.value}>{item.label}</option>
                                                            {
                                                                selectOptions.map((item, inx) => (
                                                                    <option value={item.value} key={`sub-select-option-${inx.toString()}`}>{item.label}</option>
                                                                ))
                                                            }
                                                        </Form.Select>
                                                        <IoIosRemoveCircleOutline className='mb-3 icon' onClick={() => removeSelectedSchema(index)} />
                                                    </div>

                                                ))
                                            }
                                        </div>
                                    )
                                }
                                <Form.Group
                                    className="mb-3"
                                >
                                    <Form.Select aria-label="Default select example" name='addSchema' onChange={handleChange} value={values.addSchema}>
                                        <option value=''>Add schema to segment</option>
                                        {
                                            selectOptions.map((item, inx) => (
                                                <option value={item.value} key={`main-select-option-${inx - toString()}`}>{item.label}</option>
                                            ))
                                        }
                                    </Form.Select>
                                </Form.Group>
                                <span className='add-new-schema' onClick={() => addNewSchema(setFieldValue, values)}>+ Add a new schema</span>
                                {errorMessage && <div className='error my-2'>{errorMessage}</div>}
                                <div className='mt-4 btn-block'>
                                    <Button variant="secondary" onClick={handleClose}>
                                        Close
                                    </Button>
                                    <Button variant="primary" type='submit' >
                                        Save the segment
                                    </Button>
                                </div>
                            </Form>
                        )
                    }}
                </Formik>
            </Modal.Body>
        </Modal>
    )
}
