package com.example.reviewmanagement;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;

@SpringBootTest
public class SchemaCheckTest {

    @Autowired
    private DataSource dataSource;

    @Test
    public void printSchema() throws Exception {
        System.out.println("================ SCHEMA START ================");
        try (Connection connection = dataSource.getConnection()) {
            DatabaseMetaData metaData = connection.getMetaData();
            String catalog = connection.getCatalog();
            System.out.println("Database: " + catalog);

            ResultSet tables = metaData.getTables(catalog, null, "%", new String[]{"TABLE"});
            while (tables.next()) {
                String tableName = tables.getString("TABLE_NAME");
                System.out.println("\nTable: " + tableName);
                System.out.println("----------------------------------------");

                ResultSet columns = metaData.getColumns(catalog, null, tableName, "%");
                while (columns.next()) {
                    String columnName = columns.getString("COLUMN_NAME");
                    String columnType = columns.getString("TYPE_NAME");
                    int columnSize = columns.getInt("COLUMN_SIZE");
                    System.out.printf("  - %-20s %s(%d)%n", columnName, columnType, columnSize);
                }
            }
        }
        System.out.println("================ SCHEMA END ==================");
    }
}
