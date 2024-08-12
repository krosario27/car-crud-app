import { useState, MouseEvent } from 'react';
import { useAppDispatch } from '../app/hooks';
import { addCar } from '../features/carSlice';
import { useNavigate } from 'react-router';
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddCar: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [make, setMake] = useState<string>("");
    const [model, setModel] = useState<string>("");
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [description, setDescription] = useState<string>("");

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        dispatch(addCar({
            make,
            model,
            year,
            description

        })).then(() => {
            navigate("/")
        });
    }

    return (
        <div className='container'>
            <h2>Add Employee</h2>
            <Form>
                <Form.Group className='mb-3'>
                    <Form.Label>Make</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Make"
                        value={make}
                        onChange={(e) => setMake(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label>Model</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Model"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label>Year</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Year"
                        value={year}
                        onChange={(e) => setYear(parseInt(e.target.value))}
                        required
                    />
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button variant='primary' onClick={handleClick}>
                    Add Car
                </Button>
            </Form>
        </div>
    );
}

export default AddCar;