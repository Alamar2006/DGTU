package app.vx.dgtuhack2025.repository;

import app.vx.dgtuhack2025.entity.Place;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlaceRepository extends JpaRepository<Place, String> {

    boolean existsById(String id);
}
