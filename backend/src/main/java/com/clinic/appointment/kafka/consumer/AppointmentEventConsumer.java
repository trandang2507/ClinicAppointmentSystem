package com.clinic.appointment.kafka.consumer;

import com.clinic.appointment.kafka.Events.AppointmentCancelled;
import com.clinic.appointment.kafka.Events.AppointmentCreated;
import com.clinic.appointment.kafka.Events.AppointmentStatusChanged;
import com.clinic.appointment.services.NotificationService;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class AppointmentEventConsumer {

    private final NotificationService notificationService;

    public AppointmentEventConsumer(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @KafkaListener(
            topics = "appointment-created",
            groupId = "notification-group"
    )
    public void handleCreated(AppointmentCreated event) {

        notificationService.createNotification(
                event.patientId(),
                "Đặt lịch thành công",
                "Bạn đã đặt lịch hẹn #" + event.appointmentId()
                        + " thành công vào "
                        + event.appointmentTime()
        );
    }

    @KafkaListener(
            topics = "appointment-cancelled",
            groupId = "notification-group"
    )
    public void handleCancelled(AppointmentCancelled event) {

        if (event.cancelledBy().equals("PATIENT")) {

            notificationService.createNotification(
                    event.doctorId(),
                    "Lịch hẹn đã bị hủy",
                    "Bệnh nhân đã hủy lịch hẹn #" + event.appointmentId()
                            + ". Lý do: " + event.reason()
            );

        } else if (event.cancelledBy().equals("DOCTOR")) {

            notificationService.createNotification(
                    event.patientId(),
                    "Lịch hẹn đã bị hủy",
                    "Bác sĩ đã hủy lịch hẹn #" + event.appointmentId()
                            + ". Lý do: " + event.reason()
            );
        }
    }
    @KafkaListener(
            topics = "appointment-status-changed",
            groupId = "notification-group"
    )
    public void handleStatusChanged(AppointmentStatusChanged event) {

        notificationService.createNotification(
                event.patientId(),
                "Trạng thái lịch hẹn thay đổi",
                "Lịch hẹn #" + event.appointmentId()
                        + " đã chuyển từ "
                        + event.oldStatus()
                        + " sang "
                        + event.newStatus()
        );
    }
}
