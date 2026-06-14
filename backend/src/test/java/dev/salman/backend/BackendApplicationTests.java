package dev.salman.backend;

import dev.salman.backend.config.TestInfrastructureConfig;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

@SpringBootTest
@Import(TestInfrastructureConfig.class)
class BackendApplicationTests {

	@Test
	void contextLoads() {
	}

}
