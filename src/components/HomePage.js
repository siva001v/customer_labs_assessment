import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import AddSegmentModal from './AddSegmentModal';

export default function HomePage() {

    const [showModal, setShowModal] = useState(false);

    return (
        <div className='container'>
            <Button variant='success' onClick={() => setShowModal(!showModal)}>Save Segment</Button>
            {showModal && <AddSegmentModal showModal={showModal} setShowModal={setShowModal} />}
        </div>


    )
}
