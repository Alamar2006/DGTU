package app.vx.dgtuhack2025.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "places")
public class Place {

    @Id
    @Column(nullable = false)
    private String id;

    @Column(nullable = false)
    private String latitude;

    @Column(nullable = false)
    private String longitude;

    public Place (String id, Double latitude, Double longitude) {
        this.id = id;
        this.latitude = latitude.toString();
        this.longitude = longitude.toString();
    }
}
