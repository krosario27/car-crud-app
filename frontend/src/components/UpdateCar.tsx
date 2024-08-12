import { useState, useEffect, MouseEvent } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useParams, useNavigate } from "react-router";
import { modifiedCar } from "../features/carSlice";
import { Form, Button } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';


const UpdateCar: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>();
    const { carList } = useAppSelector((state) => state.carKey);
    const [make, setMake] = useState<string>("");
    const [model, setModel] = useState<string>("");
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [description, setDescription] = useState<string>("");

    useEffect(() => {
        if (id) {
            const car = carList.find(car => car._id === id);
            if (car) {
                setMake(car.make);
                setModel(car.model);
                setYear(car.year);
                setDescription(car.description);

            }
        }
    }, [dispatch, id, carList])

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (id) {
            dispatch(modifiedCar({
                _id: id, 
                make,
                model,
                year,
                description})).then(() => {
                    navigate("/");

            });
        }
    };

    return (
        <div className='container'>
            <h2>Update Employee</h2>
            <Form>
                <Form.Group className='mb-3'>
                    <Form.Label>Make</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Make"
                        value={make}
                        onChange={(e) => setMake(e.target.value)}
                        
                    />
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label>Model</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Model"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        
                    />
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label>Year</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Year"
                        value={year}
                        onChange={(e) => setYear(parseInt(e.target.value))}
                        
                    />
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        
                    />
                </Form.Group>
                <Button variant='primary' onClick={handleClick}>
                    Update Car
                </Button>
            </Form>
        </div>
    );
}

export default UpdateCar;