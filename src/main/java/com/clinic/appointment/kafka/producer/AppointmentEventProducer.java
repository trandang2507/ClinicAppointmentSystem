package com.clinic.appointment.kafka.producer;

import com.clinic.appointment.kafka.Events.AppointmentCancelled;
import com.clinic.appointment.kafka.Events.AppointmentCreated;
import com.clinic.appointment.kafka.Events.AppointmentStatusChanged;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class AppointmentEventProducer {

    private final KafkaTemplate<String, Object>  kafkaTemplate;

    public AppointmentEventProducer( KafkaTemplate<String, Object> kafkaTemplate){
        this.kafkaTemplate = kafkaTemplate;
    }

    public void publishCreated(AppointmentCreated event){
        kafkaTemplate.send("appointment-created",
                Long.toString(event.appointmentId()),
                event);
    }

    public void publishCancelled(AppointmentCancelled event){
        kafkaTemplate.send("appointment-cancelled",
                Long.toString(event.appointmentId()),
                event);
    }

    public void publishStatusChanged(AppointmentStatusChanged event){
        kafkaTemplate.send("appointment-status-changed",
                Long.toString(event.appointmentId()),
                event);
    }

}
