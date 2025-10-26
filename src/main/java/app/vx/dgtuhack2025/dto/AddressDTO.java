package app.vx.dgtuhack2025.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class AddressDTO {
    @NotEmpty
    private List<@NotBlank String> addresses;
}
