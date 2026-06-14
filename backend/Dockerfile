# ==========================================
# Stage 1: Build stage
# ==========================================
FROM eclipse-temurin:26-jdk-alpine AS builder
WORKDIR /build

# Copy maven wrapper and pom file
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Convert line endings of mvnw to unix (in case written on Windows)
RUN apk add --no-cache dos2unix && dos2unix mvnw && chmod +x mvnw

# Resolve dependencies (cached layer)
RUN ./mvnw dependency:go-offline -B

# Copy source code and package application
COPY src/ src/
RUN ./mvnw package -DskipTests -B

# ==========================================
# Stage 2: Runtime stage
# ==========================================
FROM eclipse-temurin:26-jre-alpine AS runtime
WORKDIR /app

# Create a non-root system user and group
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

# Create a folder for logs and assign ownership
RUN mkdir -p logs && chown -R appuser:appgroup logs

# Copy built JAR from builder
COPY --from=builder --chown=appuser:appgroup /build/target/backend-0.0.1-SNAPSHOT.jar app.jar

# Set ownership and permissions
USER 1001

EXPOSE 8080

ENV SPRING_PROFILES_ACTIVE=prod
ENV JAVA_OPTS="-XX:+UseG1GC -XX:MaxRAMPercentage=75.0"

# Healthcheck checking if TCP port 8080 is open
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD nc -z localhost 8080 || exit 1

ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar app.jar"]
