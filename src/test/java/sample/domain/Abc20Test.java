package sample.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import sample.web.rest.TestUtil;

class Abc20Test {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Abc20.class);
        Abc20 abc201 = new Abc20();
        abc201.setId(1L);
        Abc20 abc202 = new Abc20();
        abc202.setId(abc201.getId());
        assertThat(abc201).isEqualTo(abc202);
        abc202.setId(2L);
        assertThat(abc201).isNotEqualTo(abc202);
        abc201.setId(null);
        assertThat(abc201).isNotEqualTo(abc202);
    }
}
