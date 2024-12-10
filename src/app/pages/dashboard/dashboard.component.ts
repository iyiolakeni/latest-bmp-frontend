import { ChangeDetectorRef, Component } from '@angular/core';
import { RequestsService } from '../../services/requests/requests.service';
import { SharedServiceService } from '../../services/shared-service/shared-service.service';
import { UserResponse } from '../../interface/books.model';
import {Chart, registerables} from 'chart.js';

interface StatusCard {
  title: string;
  count: number;
  iconName: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  trend: string;
}

interface RequestStatus {
  status: string;
  count: number;
  color: string;
}

interface LifecycleStage {
  name: string;
  isActive: boolean;
  isCompleted: boolean;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  
  pendingCount: number = 0;
  approvedCount: number = 0;
  rejectedCount: number = 0;
  deployedCount: number = 0;
  deliveredCount: number = 0;
  user!: UserResponse;
  
  statusCards: StatusCard[] = []

  // Pie Chart Data
    requestStatuses: RequestStatus[] = [
        ];
  
    // Lifecycle Stages
    lifecycleStages: LifecycleStage[] = [
      { name: 'Submitted', isActive: false, isCompleted: true },
      { name: 'Review', isActive: false, isCompleted: true },
      { name: 'Approval', isActive: true, isCompleted: false },
      { name: 'Development', isActive: false, isCompleted: false },
      { name: 'Deployment', isActive: false, isCompleted: false },
      { name: 'Delivered', isActive: false, isCompleted: false }
    ];
  
    // Notifications
    notifications: Notification[] = [
      {
        id: 1,
        title: 'New Request',
        message: 'A new request has been submitted for review',
        type: 'info',
        timestamp: new Date()
      },
      {
        id: 2,
        title: 'Approval Needed',
        message: 'Pending approval for project X',
        type: 'warning',
        timestamp: new Date()
      },
      {
        id: 3,
        title: 'Successful Deployment',
        message: 'Project Y has been successfully deployed',
        type: 'success',
        timestamp: new Date()
      }
    ];

    
  constructor(
    private requestService: RequestsService,
    private sharedService: SharedServiceService,
    private cdr: ChangeDetectorRef
  ){
    Chart.register(...registerables);
  }

  ngOnInit():void{
    this.user = this.sharedService.getUser();
    this.loadExtraData();
    setTimeout(() => {
      this.updateRequestCards();
      this.updateStausCards();
      this.createPieChart();
    }, 5000)
  }

  // getAllRequests(): void{
  //   this.requestService.getRequestsByUser(this.user.id).subscribe(
  //   (data) => {
      
  //   }
  //   )
  // }

  getPendingRequests(): void{
    this.requestService.getPendingRequests(this.user.id).subscribe(
      (data) => {
        this.pendingCount = data.data.data.length; 
  })
}

getApprovedRequests(): void{
  this.requestService.getApprovedRequest(this.user.id).subscribe(
    (data) => {
      this.approvedCount = data.data.data.length; 
  })
}

getRejectedRequests(): void{
  this.requestService.getRejectedRequests(this.user.id).subscribe(
    (data) => {
      this.rejectedCount = data.data.data.length; 
  })
}

getDeployedRequests(): void{
  this.requestService.getDeployedRequests(this.user.id).subscribe(
    (data) => {
      this.deployedCount = data.data.data.length; 
  })
}

getDeliveredRequests(): void{
  this.requestService.getDeliveredRequests(this.user.id).subscribe(
    (data) => {
      this.deliveredCount = data.data.data.length; 
  })
}

loadExtraData(): void{
  this.getApprovedRequests();
  this.getRejectedRequests();
  this.getDeployedRequests();
  this.getDeliveredRequests();
  this.getPendingRequests();
}

createPieChart(): void {
  const ctx = document.getElementById('requestPieChart') as HTMLCanvasElement;
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: this.requestStatuses.map(status => status.status),
      datasets: [{
        data: this.requestStatuses.map(status => status.count),
        backgroundColor: this.requestStatuses.map(status => status.color),
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        },
        title: {
          display: true,
          text: 'Request Distribution'
        }
      }
    }
  });
}

// Method to remove notification
removeNotification(id: number): void {
  this.notifications = this.notifications.filter(n => n.id !== id);
}

// Method to get notification icon and color
getNotificationStyles(type: string): { icon: string, bgColor: string, textColor: string } {
  switch(type) {
    case 'success':
      return { 
        icon: '✅', 
        bgColor: 'bg-green-100', 
        textColor: 'text-green-800' 
      };
    case 'warning':
      return { 
        icon: '⚠️', 
        bgColor: 'bg-yellow-100', 
        textColor: 'text-yellow-800' 
      };
    case 'error':
      return { 
        icon: '❌', 
        bgColor: 'bg-red-100', 
        textColor: 'text-red-800' 
      };
    default:
      return { 
        icon: 'ℹ️', 
        bgColor: 'bg-blue-100', 
        textColor: 'text-blue-800' 
      };
  }
}


updateStausCards():void{
  this.statusCards = [
    { 
      title: 'Pending', 
      count: this.pendingCount, 
      iconName: 'trending_up',
      bgColor: 'bg-amber-50', 
      borderColor: 'border-amber-300', 
      textColor: 'text-amber-600',
      trend: '+12%'
    },
    { 
      title: 'Approved', 
      count: this.approvedCount, 
      iconName: 'check_circle',
      bgColor: 'bg-emerald-50', 
      borderColor: 'border-emerald-300', 
      textColor: 'text-emerald-600',
      trend: '+8%'
    },
    { 
      title: 'Rejected', 
      count: this.rejectedCount, 
      iconName: 'cancel',
      bgColor: 'bg-rose-50', 
      borderColor: 'border-rose-300', 
      textColor: 'text-rose-600',
      trend: '-3%'
    },
    { 
      title: 'Deployed', 
      count: this.deployedCount, 
      iconName: 'rocket_launch',
      bgColor: 'bg-sky-50', 
      borderColor: 'border-sky-300', 
      textColor: 'text-sky-600',
      trend: '+22%'
    },
    { 
      title: 'Delivered', 
      count: this.deliveredCount, 
      iconName: 'inventory_2',
      bgColor: 'bg-indigo-50', 
      borderColor: 'border-indigo-300', 
      textColor: 'text-indigo-600',
      trend: '+15%'
    }
  ]
}

updateRequestCards(): void {
  this.requestStatuses = [
    { status: 'Pending', count: this.pendingCount, color: '#FFC107' },
    { status: 'Approved', count: this.approvedCount, color: '#4CAF50' },
    { status: 'Rejected', count: this.rejectedCount, color: '#F44336' },
    { status: 'Deployed', count: this.deployedCount, color: '#2196F3' },
    { status: 'Delivered', count: this.deliveredCount, color: '#9C27B0' }
  ];
}
}

