import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchCar, removeCar } from '../features/carSlice';
import { useNavigate } from "react-router-dom";
import { Table, Button, Toast, ToastContainer, ToastBody } from "react-bootstrap";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import 'bootstrap/dist/css/bootstrap.min.css';

interface Car {
    _id: string;
    make: string;
    model: string;
    year: number;
    description: string;
}

const Home: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading, carList, error, response } = useAppSelector(
        (state) => state.carKey
    );
    const [showToast, setShowToast] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string>("");

    useEffect(() => {
        dispatch(fetchCar());
    }, [dispatch]);

    useEffect(() => {
        if(response) {
            setToastMessage(response);
            setShowToast(true);
        }
    }, [response]);

    const navigateToAddCar = () => {
        navigate("/add");
    }

    const navigateToUpdateCar = (id: string) => {
        navigate(`/update/${id}`);

    }

    const deleteCar = (id: string) => {
        dispatch(removeCar(id))
            .then(() => dispatch(fetchCar()));
        handleClickSnackbar();
    }

    const [open, setOpen] = useState<boolean>(false);

    const handleClickSnackbar = () => {
        setOpen(true);
    }


    return (
        <div className='container mt-6'>
            <Button className='mb-3' onClick={navigateToAddCar}>
                Add Car
            </Button>
            <Table striped bordered hover variant='dark'>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Make</th>
                        <th>Model</th>
                        <th>Year</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loading && (
                        <tr>
                            <td colSpan={6} className='text-center'>Loading...</td>
                        </tr>
                    )}
                    {!loading && carList.length === 0 && (
                        <tr>
                            <td colSpan={6} className='text-center'>No records</td>
                        </tr>
                    )}
                    {!loading && error && (
                        <tr>
                            <td colSpan={6} className='text-center'>{error}</td>
                        </tr>
                    )}
                    {!loading && carList && carList.map((item, index) => (
                        <tr key={item._id}>
                            <td>{index + 1}</td>
                            <td>{item.make}</td>
                            <td>{item.model}</td>
                            <td>{item.year}</td>
                            <td>{item.description}</td>
                            <td>
                                <Button className='btn-link text-primary' onClick={() => navigateToUpdateCar(item._id)}>
                                    <EditIcon />
                                </Button>
                                <Button className='btn-link text-danger' onClick={() => deleteCar(item._id)}>
                                    <DeleteIcon />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <ToastContainer position='top-center'>
                <Toast onClose={() => setShowToast(false)}
                show={showToast}
                delay={2000}
                autohide
                style={{ backgroundColor: '#343a40', color: 'white' }}
                >
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>

            </ToastContainer>
        </div>
    );
}

export default Home;


