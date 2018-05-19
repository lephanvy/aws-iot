import { Injectable } from '@angular/core';

@Injectable()
export class NotificationService {

  constructor() { }

  notificationData = [
    {
      id: 1,
      name: 'Bruce Mann',
      avatar: '',
      detail: 'Sent a review request to Amanda Nunes',
      time: '3 min ago',
      read: false
    },
    {
      id: 2,
      name: 'Henry J',
      avatar: '../../assets/img/user1.jpg',
      detail: 'Sent a review request to Amanda Nunes',
      time: '3 min ago',
      read: true
    },
    {
      id: 3,
      icon: 'fa fa-star',
      detail: 'Our average rating goes up!',
      time: '3 min ago',
      read: true,
      success: true
    },
    {
      id: 4,
      icon: 'fa fa-exclamation-triangle',
      detail: 'Server load is 95%, trying to reduce it!',
      time: '3 min ago',
      read: true,
      warning: true
    },
    {
      id: 5,
      name: 'Henry J',
      avatar: '../../assets/img/user2.jpg',
      detail: 'Sent a review request to Amanda Nunes',
      time: '3 min ago',
      read: true
    },
    {
      id: 6,
      icon: 'fa fa-user-times',
      detail: '7 Subscrption plan not renewed!',
      time: '3 min ago',
      read: true,
      danger: true
    },
    {
      id: 7,
      name: 'Bruce Mann',
      avatar: '',
      detail: 'Sent a review request to Amanda Nunes',
      time: '3 min ago',
      read: false
    },
    {
      id: 8,
      name: 'Henry J',
      avatar: '../../assets/img/user1.jpg',
      detail: 'Sent a review request to Amanda Nunes',
      time: '3 min ago',
      read: true
    },
    {
      id: 9,
      icon: 'fa fa-star',
      detail: 'Our average rating goes up!',
      time: '3 min ago',
      read: true,
      success: true
    },
    {
      id: 10,
      icon: 'fa fa-exclamation-triangle',
      detail: 'Server load is 95%, trying to reduce it!',
      time: '3 min ago',
      read: true,
      warning: true
    },
    {
      id: 11,
      name: 'Henry J',
      avatar: '../../assets/img/user2.jpg',
      detail: 'Sent a review request to Amanda Nunes',
      time: '3 min ago',
      read: true
    },
    {
      id: 12,
      icon: 'fa fa-user-times',
      detail: '7 Subscrption plan not renewed!',
      time: '3 min ago',
      read: true,
      danger: true
    },
  ]

}
