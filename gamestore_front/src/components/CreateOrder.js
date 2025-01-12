import React, { useState } from 'react';
import { createOrder } from '../api/orderApi';

const CreateOrder = () => {
    const [order, setOrder] = useState({
        email: '',
        appId: '',
        gameName: '',
        purchasePrice: 0.0,
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOrder((prevOrder) => ({
            ...prevOrder,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const createdOrder = await createOrder(order);
            setMessage(`주문이 성공적으로 생성되었습니다. 주문 ID: ${createdOrder.orderId}`);
            setOrder({
                email: '',
                appId: '',
                gameName: '',
                purchasePrice: 0.0,
            });
        } catch (error) {
            setMessage('주문 생성 중 오류가 발생했습니다.');
            console.error(error);
        }
    };

    return (
        <div>
            <h2>주문 생성</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    value={order.email}
                    onChange={handleChange}
                    placeholder="이메일"
                    required
                />
                <input
                    type="number"
                    name="appId"
                    value={order.appId}
                    onChange={handleChange}
                    placeholder="게임 ID"
                    required
                />
                <input
                    type="text"
                    name="gameName"
                    value={order.gameName}
                    onChange={handleChange}
                    placeholder="게임 이름"
                    required
                />
                <input
                    type="number"
                    name="purchasePrice"
                    value={order.purchasePrice}
                    onChange={handleChange}
                    placeholder="구매 가격"
                    step="0.01"
                    required
                />
                <button type="submit">주문 생성</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default CreateOrder;
