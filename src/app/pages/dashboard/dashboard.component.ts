import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { RequestsService } from '../../services/requests/requests.service';
import { SharedServiceService } from '../../services/shared-service/shared-service.service';
import { ApiResponse, UserResponse } from '../../interface/books.model';
import {Chart, ChartConfiguration, ChartType, registerables} from 'chart.js';
import { finalize, forkJoin, Observable, Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { ApproveRequestService } from '../../services/approve-request/approve-request.service';
import { DeployedTableService } from '../../services/deployed-table/deployed-table.service';

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
  description?: string;
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
  @ViewChild('chartCanvas', {static: false}) chartCanvas?: ElementRef<HTMLCanvasElement>
  
  pendingCount: number = 0;
  approvedCount: number = 0;
  rejectedCount: number = 0;
  deployedCount: number = 0;
  deliveredCount: number = 0;
  user!: UserResponse;
  loading: boolean = false;
  dateToday: string | null = new DatePipe('en-US').transform(new Date(), 'EEE, MMM d');
  processingTime: number = 0;
  private subscriptions: Subscription[] = [] ;
  
  statusCards: StatusCard[] = []

  // Donought Chart Data
    requestStatuses: RequestStatus[] = [];
    selectedRequestStatus: RequestStatus | null = null;
    private chartInstance: Chart | null = null;

    public donutChartType: ChartType = 'doughnut';
    public donutChartOptions: ChartConfiguration['options'] = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
          }
        },
        title: {
          display: true,
          text: 'Request Distribution',
        },
        tooltip:{
          callbacks: {
            label: (context: { label?: string; parsed: number; dataset: { data: unknown[] } }) => {
              const label = context.label || '';
              const value = context.parsed || 0;
              
              // Safely calculate total
              const total = context.dataset.data.reduce((acc: number, curr: unknown) => {
                const numValue = typeof curr === 'number' ? curr : 0;
                return acc + numValue;
              }, 0);
            
              const percentage = total > 0 
                ? ((value / total) * 100).toFixed(1)
                : '0';
            
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      },
      onClick: (event, elements) => {
        if (elements.length > 0){
          const index = elements[0].index;
          this.selectRequestStatus(this.requestStatuses[index]);
        }
      }
    }

    public donutChartData: ChartConfiguration['data'] = {
      datasets: [{
        data: [],
        backgroundColor: [],
        hoverBackgroundColor: []
      }],
      labels: []
    }
  
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
    private approvalService: ApproveRequestService,
    private deployService: DeployedTableService,
    private cdr: ChangeDetectorRef
  ){
    Chart.register(...registerables);
  }

  ngOnInit():void{
    this.user = this.sharedService.getUser();
    this.loadExtraData();
    
  }

  ngAfterViewInit(): void {
    // Use microtask to ensure view is fully initialized
    Promise.resolve().then(() => {
      this.initializeChart();
    });
  }

  ngOnDestroy(): void {
    // Ensure chart is destroyed when component is destroyed
    this.destroyChart();
  }

  private initializeChart(): void {
    this.destroyChart();

    if(!this.loading){
      if (!this.chartCanvas) {
        console.error('Chart canvas is not available');
        return;
      }
    }

    const ctx = this.chartCanvas?.nativeElement.getContext('2d');

    if (ctx) {
      // Create new chart
      this.chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: this.getChartData(),
        options: this.donutChartOptions
      });
    } else {
      // console.error('Failed to get 2D context');
      return;
    }
  }

  private destroyChart(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }
  }

  loadExtraData(): void {
    this.loading = true;
    this.trackRequests();
  
    let observables: { [key: string]: Observable<any> } = {};
  
    if (this.user.jobPosition === 'Account Officer') {
      observables = {
        pending: this.requestService.getPendingRequests(this.user.id),
        approved: this.requestService.getApprovedRequest(this.user.id),
        rejected: this.requestService.getRejectedRequests(this.user.id),
        deployed: this.requestService.getDeployedRequests(this.user.id),
        delivered: this.requestService.getDeliveredRequests(this.user.id)
      };
    } else if (this.user.jobPosition === 'Business Developer') {
      observables = {
        pending: this.approvalService.getPendinRequest(),
        approved: this.approvalService.getApprovedRequest(),
        rejected: this.approvalService.getRejectedRequest()
      };
    } else if (this.user.jobPosition === 'POS Business Officer') {
      observables = {
        pending: this.deployService.getPendinRequest(),
        deployed: this.deployService.getDeployedRequest(),
        delivered: this.deployService.getDeliveredRequest()
      };
    }
  
    forkJoin(observables).pipe(
      finalize(() => {
        this.updateRequestCards();
        this.updateStausCards();
        this.loading = false;
        this.cdr.detectChanges();
        this.updateDonutChart();
      })
    ).subscribe({
      next: (results: any) => {
        this.pendingCount = results.pending?.data.data.length || 0;
        this.approvedCount = results.approved?.data.data.length || 0;
        this.rejectedCount = results.rejected?.data.data.length || 0;
        this.deployedCount = results.deployed?.data.data.length || 0;
        this.deliveredCount = results.delivered?.data.data.length || 0;
      },
      error: (error: any) => {
        console.error('Error loading dashboard data', error);
        this.loading = false;
      }
    });
  }

  updateRequestCards(): void {
    this.requestStatuses = [
      { 
        status: 'Pending', 
        count: this.pendingCount, 
        color: '#FFC107',
        description: 'Requests awaiting initial review and processing'
      },
      { 
        status: 'Approved', 
        count: this.approvedCount, 
        color: '#4CAF50',
        description: 'Requests that have been reviewed and approved'
      },
      { 
        status: 'Rejected', 
        count: this.rejectedCount, 
        color: '#F44336',
        description: 'Requests that did not meet the required criteria'
      },
      { 
        status: 'Deployed', 
        count: this.deployedCount, 
        color: '#2196F3',
        description: 'Requests that have been implemented and are in production'
      },
      { 
        status: 'Delivered', 
        count: this.deliveredCount, 
        color: '#9C27B0',
        description: 'Finalized requests that have been completed and delivered'
      }
    ];
  }

  updateDonutChart(): void {
    if (this.chartInstance) {
      this.chartInstance.data = this.getChartData();
      this.chartInstance.update();
    } else {
      this.initializeChart();
    }
  }

  getChartData(): ChartConfiguration['data'] {
    return {
      datasets: [{
        data: this.requestStatuses.map(status => status.count),
        backgroundColor: this.requestStatuses.map(status => status.color),
        hoverBackgroundColor: this.requestStatuses.map(status => this.darkenColor(status.color, 0.2))
      }],
      labels: this.requestStatuses.map(status => status.status)
    };
  }

  // Utility method to darken colors for hover effect
  darkenColor(color: string, percent: number): string {
    const num = parseInt(color.slice(1), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, Math.min(255, (num >> 16) - amt));
    const B = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) - amt));
    const G = Math.max(0, Math.min(255, (num & 0x0000FF) - amt));
    return `#${(0x1000000 + R * 0x10000 + B * 0x100 + G).toString(16).slice(1)}`;
  }


  // Method to handle status selection
  selectRequestStatus(status: RequestStatus): void {
    this.selectedRequestStatus = status;
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
  if (this.user.jobPosition === 'Account Officer') {
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
}else if (this.user.jobPosition === 'Business Developer') {
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
    }
  ]
} else if (this.user.jobPosition === 'POS Business Officer') {
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
}

createNewRequest() {
  // Implement navigation or modal for creating a new request
  console.log('Create New Request');
}

viewApprovals() {
  // Implement navigation to approvals view
  console.log('View Approvals');
}

generateReport() {
  console.log('Generate Report');
}

trackRequests() {
  this.subscriptions.push(
    this.requestService.getProcessingTime().subscribe(
      (data: ApiResponse<number>) => {
        this.processingTime = data.data.data
        console.log('Response ', this.processingTime)
      }
    )
  )
}

}

