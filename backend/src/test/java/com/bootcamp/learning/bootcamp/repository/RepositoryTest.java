//package com.bootcamp.learning.bootcamp.repository;
//
//import com.bootcamp.learning.bootcamp.repository.repositoryImpl.SnowflakeRepository;
//import org.springframework.jdbc.core.JdbcTemplate;
//import org.springframework.jdbc.datasource.DriverManagerDataSource;
//
//import java.sql.Date;
//import java.time.LocalDate;
//import java.util.List;
//import java.util.Map;
//
//public class RepositoryTest {
//
//    public static void main(String[] args) {
//        new RepositoryTest().test();
//    }
//
//    public void test() {
//        // 1. Setup simple DataSource (adjust URL, username, password)
//        DriverManagerDataSource dataSource = new DriverManagerDataSource();
//        dataSource.setDriverClassName("net.snowflake.client.jdbc.SnowflakeDriver");
//        dataSource.setUrl("jdbc:snowflake://YFYRZGG-BWB35436.snowflakecomputing.com/?db=AWS&schema=COST");
//        dataSource.setUsername("ro_user");
//        dataSource.setPassword("fRe$her@b00tc@mp2025");
//
//        // 2. Create JdbcTemplate
//        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
//
//        // 3. Create your repository manually
//        SnowflakeRepository repository = new SnowflakeRepository(jdbcTemplate);
//
//        // 4. Run your test
//        LocalDate startDate = LocalDate.of(2025, 5, 1);  // May 2025
//        LocalDate endDate = LocalDate.of(2025, 8, 31);   // Aug 2025
//
//        // Convert to java.sql.Date
//        Date sqlStartDate = Date.valueOf(startDate);
//        Date sqlEndDate = Date.valueOf(endDate);
//
//        List<Map<String, Object>> results = repository.getProductCostsMonthwise(startDate, endDate);
//
//        for (Map<String, Object> row : results) {
//            System.out.println(row);
//        }
//    }
//}
