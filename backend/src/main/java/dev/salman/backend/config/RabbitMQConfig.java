package dev.salman.backend.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.JacksonJsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String EXCHANGE = "pms.direct.exchange";
    public static final String AUDIT_QUEUE = "queue.audit-logging";
    public static final String NOTIFICATION_QUEUE = "queue.notifications";
    public static final String AUDIT_ROUTING_KEY = "routing.audit";
    public static final String NOTIFICATION_ROUTING_KEY = "routing.notifications";

    @Bean
    public DirectExchange exchange() {
        return new DirectExchange(EXCHANGE);
    }

    @Bean
    public Queue auditQueue() {
        return QueueBuilder.durable(AUDIT_QUEUE).build();
    }

    @Bean
    public Queue notificationQueue() {
        return QueueBuilder.durable(NOTIFICATION_QUEUE).build();
    }

    @Bean
    public Binding auditBinding(Queue auditQueue, DirectExchange exchange) {
        return BindingBuilder.bind(auditQueue).to(exchange).with(AUDIT_ROUTING_KEY);
    }

    @Bean
    public Binding notificationBinding(Queue notificationQueue, DirectExchange exchange) {
        return BindingBuilder.bind(notificationQueue).to(exchange).with(NOTIFICATION_ROUTING_KEY);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new JacksonJsonMessageConverter();
    }
}
