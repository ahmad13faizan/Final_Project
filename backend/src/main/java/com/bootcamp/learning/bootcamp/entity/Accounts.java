package com.bootcamp.learning.bootcamp.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
@Entity
@Table(name = "accounts")
public class Accounts {

    @Id
    @Column(nullable = false)
    private int AccountId;

    @Column(nullable = false)
    private String arn;

    @Column(nullable = false)
    private String AccountName;

    private Boolean is_orphan;

    // ✅ No users field here

    public Accounts(int accountId, String arn, String accountName, Boolean isOrphan) {
        this.AccountId = accountId;
        this.arn = arn;
        this.AccountName = accountName;
        this.is_orphan = isOrphan;
    }

    @Override
    public String toString() {
        return "Accounts{" +
                "AccountId=" + AccountId +
                ", arn='" + arn + '\'' +
                ", AccountName='" + AccountName + '\'' +
                ", is_orphan=" + is_orphan +
                '}';
    }
}
