import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Spinner, Alert, Button } from 'react-bootstrap';
import { fetchProfile } from '../http/userAPI';
import { toast } from 'react-toastify';
import { FaCopy } from 'react-icons/fa';

const ProfilePage = () => {
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProfile()
            .then(data => setProfile(data))
            .catch(e => setError(e.response?.data?.message || 'Не удалось загрузить профиль'))
            .finally(() => setLoading(false));
    }, []);

    const handleCopyCode = () => {
        if (profile.referralCode) {
            navigator.clipboard.writeText(profile.referralCode);
            toast.success('Реферальный код скопирован в буфер обмена!');
        }
    };

    if (loading) return <Container className="d-flex justify-content-center mt-5"><Spinner animation="border" /></Container>;
    if (error) return <Container className="mt-5"><Alert variant="danger">{error}</Alert></Container>;

    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="shadow-sm">
                        <Card.Header as="h4">Личный кабинет</Card.Header>
                        <Card.Body className="p-4">
                            <Card.Text>
                                <strong>Email:</strong> {profile.email}
                            </Card.Text>
                            <Card.Text>
                                <strong>Роль:</strong> {profile.role}
                            </Card.Text>
                            <hr />
                            <h5 className="mt-4">Ваша реферальная программа</h5>
                            <p>Поделитесь этим кодом с друзьями, чтобы получить скидку!</p>
                            <div className="d-flex align-items-center gap-3 p-3 bg-light rounded">
                                <strong className="fs-4 text-success font-monospace">{profile.referralCode}</strong>
                                <Button variant="outline-secondary" size="sm" onClick={handleCopyCode}>
                                    <FaCopy className="me-2" /> Копировать
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ProfilePage;