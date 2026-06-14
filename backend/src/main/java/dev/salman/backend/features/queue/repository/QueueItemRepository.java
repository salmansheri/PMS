package dev.salman.backend.features.queue.repository;

import dev.salman.backend.features.queue.entity.QueueItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface QueueItemRepository extends JpaRepository<QueueItem, UUID> {
    List<QueueItem> findByDoctorIdAndStatusOrderByTokenNumberAsc(UUID doctorId, String status);
    List<QueueItem> findByStatusOrderByCheckedInTimeAsc(String status);
    
    @Query("SELECT COALESCE(MAX(q.tokenNumber), 0) FROM QueueItem q")
    Integer findMaxTokenNumber();

    Optional<QueueItem> findByPatientIdAndStatusIn(UUID patientId, List<String> statuses);
}
