package ca.firstvoices.utils;

import java.io.Serializable;
import java.util.List;

public class FVExportWorkInfo implements Serializable
{
    public String fileName;
    public String fileNameAsSaved;
    public String filePath;
    public String initiatorName;
    public String dialectName;
    public String dialectGUID;
    public String resourcesFolderGUID;
    public String exportFormat;
    public String exportQuery;
    public long fileLength;
    public String workDigest;       // connects principal with export query based on  MD5( principal.name + principal.hash )
    public String exportDigest;     // identifies export based on query, columns and principal info ( MD5 hash )
    public List<String> columns;

    public String getFullFileName()
    {
        if( filePath == null || fileNameAsSaved == null) return null;

        return filePath + fileNameAsSaved;
    }

    public String getWrapperName()
    {
        return "Export-" + exportDigest;
    }
}
