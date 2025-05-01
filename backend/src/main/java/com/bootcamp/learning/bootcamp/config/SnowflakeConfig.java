package com.bootcamp.learning.bootcamp.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.SimpleDriverDataSource;

import javax.sql.DataSource;
import java.util.Properties;

@Configuration
public class SnowflakeConfig {

    @Value("${snowflake.url}")
    private String url;

    @Value("${snowflake.user}")
    private String user;

    @Value("${snowflake.password}")
    private String password;

    @Value("${snowflake.warehouse}")
    private String warehouse;

    @Value("${snowflake.database}")
    private String database;

    @Value("${snowflake.schema}")
    private String schema;

    @Bean(name = "snowflakeDataSource")
    public DataSource snowflakeDataSource() {
        Properties properties = new Properties();
        properties.put("user", user);
        properties.put("password", password);
        properties.put("warehouse", warehouse);
        properties.put("db", database);
        properties.put("schema", schema);

        return new SimpleDriverDataSource(new net.snowflake.client.jdbc.SnowflakeDriver(), url, properties);
    }

    @Bean(name = "snowflakeJdbcTemplate")
    public JdbcTemplate snowflakeJdbcTemplate(@Qualifier("snowflakeDataSource") DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }
}
