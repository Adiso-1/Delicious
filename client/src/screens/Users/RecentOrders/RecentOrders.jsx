import Navbar from '../../../components/NavbarUser/NavbarUser';
import api from '../../../api/api';
import { useState, useEffect } from 'react';
import OrderToShow from '../../../components/OrderToShow/OrderToShow';
import StarRating from '../../../components/StarRating/StarRating';
import Spinner from '../../../components/Spinner/Spinner';
import dateFormat from 'dateformat';
import config from '../../../utils/authConfig';
import './RecentOrders.css';

const RecentOrders = () => {
	const [orders, setOrders] = useState([]);
	const [personalDetails, setPersonalDetails] = useState(null);
	const [orderToShow, setOrderToShow] = useState(null);
	const [orderTofeedback, setOrderTofeedback] = useState(false);

	const getUserInfo = async () => {
		const [userDetails, recentOrders] = await Promise.allSettled([
			api.get(`/users/profile`, config('authTokenUsers')),
			api.get('/orders/userInfo', config('authTokenUsers')),
		]);
		setOrders(recentOrders.value.data);
		setPersonalDetails(userDetails.value.data);
	};

	useEffect(() => {
		getUserInfo();
	}, []);

	return (
		<div className="recent-orders-container">
			<Navbar personalDetails={personalDetails} userOrders={orders} />
			{!personalDetails ? (
				<Spinner />
			) : (
				<>
					<div className="uncompleted-orders">
						<h2>Orders on delivery</h2>
						<div className="table">
							<table className="uncompleted-table">
								<thead>
									<tr>
										<th>Restaurant</th>
										<th>Date</th>
										<th>Delivered to</th>
										<th>Price</th>
										<th></th>
									</tr>
								</thead>

								{orders.map((el) =>
									el.isCompleted === 'false' ? (
										<tbody key={el._id}>
											<tr>
												<td>{el.restaurant}</td>
												<td>{dateFormat(el.dateAdded, 'dd/mm/yy HH:MM:ss')}</td>
												<td>
													<span>{el.deliveryAddress.city}</span>,{' '}
													<span>{el.deliveryAddress.street}</span>,{' '}
													<span>{el.deliveryAddress.number}</span>/
													<span>{el.deliveryAddress.apartment}</span>
												</td>
												<td>{el.price}&#8362;</td>
												<td onClick={(e) => setOrderToShow(el)}>
													<span className="show-details-span">Show order</span>
												</td>
											</tr>
										</tbody>
									) : null
								)}
							</table>
						</div>
					</div>

					<div className="completed-orders">
						<h2>Recent orders</h2>
						<div className="table">
							<table className="uncompleted-table">
								<thead>
									<tr>
										<th>Restaurant</th>
										<th>Date</th>
										<th>Delivered to</th>
										<th>Price</th>
										<th>Your feedback</th>
										<th></th>
									</tr>
								</thead>
								{orders.map((el) =>
									el.isCompleted === 'true' ? (
										<tbody key={el._id}>
											<tr>
												<td>{el.restaurant}</td>
												<td>{dateFormat(el.dateAdded, 'dd/mm/yy HH:MM:ss')}</td>
												<td>
													<span>{el.deliveryAddress.city}</span>,{' '}
													<span>{el.deliveryAddress.street}</span>,{' '}
													<span>{el.deliveryAddress.number}</span>/
													<span>{el.deliveryAddress.apartment}</span>
												</td>
												<td>{el.price}&#8362;</td>
												{el.rating ? (
													<td>
														{[...Array(Number(el.rating))].map((e, i) => (
															<i key={i} className="fas fa-star star-full"></i>
														))}
														{[...Array(Number(5 - el.rating))].map((e, i) => (
															<i key={i} className="fas fa-star star-empty"></i>
														))}
													</td>
												) : (
													<td onClick={(e) => setOrderTofeedback(el)}>
														<span className="leave-feedback-span">
															Leave feedback
														</span>
													</td>
												)}
												<td onClick={(e) => setOrderToShow(el)}>
													<span className="show-details-span">Show order</span>
												</td>
											</tr>
										</tbody>
									) : null
								)}
							</table>
						</div>
						{orderToShow && (
							<OrderToShow data={orderToShow} closePopUp={setOrderToShow} />
						)}
						{orderTofeedback && (
							<StarRating
								data={orderTofeedback}
								closePopUp={setOrderTofeedback}
								getUserInfo={getUserInfo}
							/>
						)}
					</div>
				</>
			)}
		</div>
	);
};
export default RecentOrders;
