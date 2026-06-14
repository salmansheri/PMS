package dev.salman.backend.config;

import org.mockito.Mockito;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;

@TestConfiguration
public class TestInfrastructureConfig {

    @Bean
    @Primary
    public RabbitTemplate rabbitTemplate() {
        return Mockito.mock(RabbitTemplate.class);
    }

    @Bean
    @Primary
    public RedisConnectionFactory redisConnectionFactory() {
        return Mockito.mock(RedisConnectionFactory.class);
    }

    @Bean
    @Primary
    @SuppressWarnings("unchecked")
    public RedisTemplate<String, Object> redisTemplate() {
        return Mockito.mock(RedisTemplate.class);
    }
}
