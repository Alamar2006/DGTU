package app.vx.dgtuhack2025.repository;

import app.vx.dgtuhack2025.entity.Point;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PointRepository extends JpaRepository<Point, Long> {
    Point findBySessionId(String sessionId);

    @Query("SELECT p FROM Point p WHERE p.sessionId = :sessionId")
    List<Point> findsBySessionId(String sessionId);

    @Modifying
    @Query("DELETE FROM Point u WHERE u.createdAt < :threshold")
    void deleteOldSessions(LocalDateTime threshold);

}
