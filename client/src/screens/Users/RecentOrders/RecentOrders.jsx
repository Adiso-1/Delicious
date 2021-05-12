import Navbar from '../../../components/NavbarUser/NavbarUser';
import api from '../../../api/api';
import './RecentOrders.css';
import { useState, useEffect } from 'react';
import dateFormat from 'dateformat';

const RecentOrders = () => {
	const [orders, setOrders] = useState([]);

	const getUserInfo = async () => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
			},
		};
		const { data } = await api.get('/orders/userInfo', config);
		setOrders(data);
	};
	useEffect(async () => {
		getUserInfo();
	}, []);
	return (
		<div className="recent-orders-container">
			<Navbar />
			<div className="uncompleted-orders">
				<h2>Uncompleted Orders</h2>
				<table className="uncompleted-table">
					<tr>
						<th>Restaurant</th>
						<th>Delivered To</th>
						<th>Date</th>
						<th>Price</th>
					</tr>
					{orders.map((el) =>
						el.isCompleted === 'false' ? (
							<tr>
								<td>{el.restaurant}</td>
								<td>{el.deliveryAddress}</td>
								<td>{dateFormat(el.dateAdded, 'dd/mm/yy')}</td>
								<td>{el.price}&#8362;</td>
							</tr>
						) : null
					)}
				</table>
			</div>

			<div className="completed-orders">
				<h2>Completed Orders</h2>
				<table className="uncompleted-table">
					<tr>
						<th>Restaurant</th>
						<th>Date</th>
						<th>Delivered To</th>
						<th>Price</th>
					</tr>
					{orders.map((el) =>
						el.isCompleted === 'true' ? (
							<tr>
								<td>{el.restaurant}</td>
								<td>{el.deliveryAddress}</td>
								<td>{dateFormat(el.dateAdded, 'dd/mm/yy')}</td>
								<td>{el.price}&#8362;</td>
							</tr>
						) : null
					)}
				</table>
			</div>
		</div>
	);
};
export default RecentOrders;
