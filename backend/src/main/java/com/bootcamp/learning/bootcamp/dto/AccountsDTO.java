package com.bootcamp.learning.bootcamp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AccountsDTO {

    @NotNull(message = "AccountId is required")
    private Long accountId;

    @NotBlank(message = "ARN cannot be blank")
    @Pattern(regexp = "^arn:aws:[\\w-]+:[\\w-]*:\\d{12}:.+$",
            message = "Invalid AWS ARN format")
    private String arn;

    @NotBlank(message = "Account Name cannot be blank")
    private String accountName;

    @NotBlank(message = "Region cannot be blank")
    private String region;

}
