package com.extrasafe.android.app;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.v7.app.ActionBarActivity;
import android.view.Menu;
import android.view.View;
import android.content.Context;
import android.widget.TextView;
import android.widget.Toast;

/**
 * Created by saipranav on 14/8/14.
 */
public class SettingsActivity extends ActionBarActivity {

    String extraSecuritySequence = "";
    int startIndex = 0;
    int endIndex = 12;
    String extraSecuritySequenceKey = "extraSecuritySequenceKey";
    String startIndexKey = "startIndexKey";
    String endIndexKey = "endIndexKey";
    SharedPreferences preferences;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_settings);
        preferences = getSharedPreferences("Extrasafe Preferences", Context.MODE_PRIVATE);
        initialize();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }

    public void save(View view){
        extraSecuritySequence = ((TextView) findViewById(R.id.extraSecuritySequence)).getText().toString();
        startIndex = Integer.parseInt(((TextView) findViewById(R.id.startIndex)).getText().toString());
        endIndex = Integer.parseInt(((TextView) findViewById(R.id.endIndex)).getText().toString());
        if( (startIndex<0) || (endIndex>128) || (startIndex>=endIndex) || (startIndex>116) || (endIndex<12) || ((endIndex-startIndex)<12) ){
            Toast.makeText(this, "Options are not saved because the criteria is not matched", Toast.LENGTH_LONG).show();
            return;
        }
        SharedPreferences.Editor editor = preferences.edit();
        editor.putString(extraSecuritySequenceKey,extraSecuritySequence);
        editor.putInt(startIndexKey,startIndex);
        editor.putInt(endIndexKey,endIndex);
        editor.commit();
        Toast.makeText(this, "All options are saved", Toast.LENGTH_SHORT).show();
    }

    public void cancel(View view){
        this.finish();
    }

    public void reset(View view){
        extraSecuritySequence = "";
        startIndex = 0;
        endIndex = 12;
        SharedPreferences.Editor editor = preferences.edit();
        editor.putString(extraSecuritySequenceKey,extraSecuritySequence);
        editor.putInt(startIndexKey,startIndex);
        editor.putInt(endIndexKey,endIndex);
        editor.commit();
        Toast.makeText(this, "All options are reset to default", Toast.LENGTH_SHORT).show();
        ((TextView) findViewById(R.id.extraSecuritySequence)).setText(extraSecuritySequence);
        ((TextView) findViewById(R.id.startIndex)).setText(String.valueOf(startIndex));
        ((TextView) findViewById(R.id.endIndex)).setText(String.valueOf(endIndex));
    }

    public void initialize(){

        if(!preferences.contains(extraSecuritySequenceKey) || !preferences.contains(startIndexKey) || !preferences.contains(endIndexKey)){
            extraSecuritySequence = "";
            startIndex = 0;
            endIndex = 12;
            SharedPreferences.Editor editor = preferences.edit();
            editor.putString(extraSecuritySequenceKey, "");
            editor.putInt(startIndexKey,0);
            editor.putInt(endIndexKey,12);
            editor.commit();
        }
        else{
            extraSecuritySequence = preferences.getString(extraSecuritySequenceKey, "");
            startIndex = preferences.getInt(startIndexKey, 0);
            endIndex = preferences.getInt(endIndexKey, 12);
        }

        ((TextView) findViewById(R.id.extraSecuritySequence)).setText(extraSecuritySequence);
        ((TextView) findViewById(R.id.startIndex)).setText(String.valueOf(startIndex));
        ((TextView) findViewById(R.id.endIndex)).setText(String.valueOf(endIndex));

    }

}
